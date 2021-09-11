import React from "react";
import LengthControl from "./LengthControl";
import { clock, convert } from "./functions";

/* Stateful component */
class Timer extends React.Component {
  constructor(props) {
    super(props);

    // States
    this.state = {
      bkLen: 5,
      sessionLen: 25,
      btnClass: "fas fa-play fa-2x text-success",
      started: false,
      timerType: "Session",
      timer: 1500,
      clock: null,
      alarmClass: "border border-secondary bg-info text-white"
    };

    // Functions
    this.setBkLen = this.setBkLen.bind(this);
    this.setSessionLen = this.setSessionLen.bind(this);
    this.updateCheck = this.updateCheck.bind(this);
    this.toTimer = this.toTimer.bind(this);
    this.playCheck = this.playCheck.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.beginCntDwn = this.beginCntDwn.bind(this);
    this.cntDwn = this.cntDwn.bind(this);
    this.phaseCheck = this.phaseCheck.bind(this);
    this.warn = this.warn.bind(this);
    this.buzz = this.buzz.bind(this);
    this.reset = this.reset.bind(this);
  }

  setBkLen(e) {
    let { bkLen } = this.state;
    
    if (
      e.target.id == "break-increment" ||
      e.target.parentElement.id == "break-increment"
    ) {
      if (bkLen < 60) {
        this.updateCheck("bkLen", bkLen, "Break", " + ");
      }
    } else if (
      e.target.id == "break-decrement" ||
      e.target.parentElement.id == "break-decrement"
    ) {
      if (bkLen > 1) {
        this.updateCheck("bkLen", bkLen, "Break", " - ");
      }
    }
  }

  setSessionLen(e) {
    let { sessionLen } = this.state;
    
    if (
      e.target.id === "session-increment" ||
      e.target.parentElement.id === "session-increment"
    ) {
      if (sessionLen < 60) {
        this.updateCheck("sessionLen", sessionLen, "Session", " + ");
      }
    } else if (
      e.target.id == "session-decrement" ||
      e.target.parentElement.id == "session-decrement"
    ) {
      if (sessionLen > 1) {
        this.updateCheck("sessionLen", sessionLen, "Session", " - ");
      }
    }     
  }
  
  updateCheck(state, val, type, op) {
    if (this.state.started) {
      return;
    }
    
    this.setState({[state]: convert(val + op + "1")});
    
    if (this.state.timerType === type) {
      this.setState((state) => ({ 
        timer: convert(val + " * 60" + op + "60")
      }));
    }
  }

  playCheck() {
    if (!this.state.started) {
      this.setState({
        btnClass: "fas fa-stop fa-2x text-danger",
        started: true
      });
      this.beginCntDwn();
    } else {
      this.setState({
        btnClass: "fas fa-play fa-2x text-success",
        started: false
      });

      if (this.state.clock) {
        this.state.clock.cancel();
      }
    }
  }

  formatTime() {
    let min = Math.floor(this.state.timer / 60);
    let sec = this.state.timer - min * 60;
    sec = sec < 10 ? "0" + sec : sec;
    min = min < 10 ? "0" + min : min;
    return min + ":" + sec;
  }

  beginCntDwn() {
    this.setState({
      clock: clock(() => {
        this.cntDwn();
        this.phaseCheck();
      }, 1000)
    });
  }

  cntDwn() {
    this.setState({ timer: this.state.timer - 1 });
  }

  phaseCheck() {
    const { timer, timerType } = this.state;
    this.warn(timer);
    this.buzz(timer);

    if (timer < 0) {
      if (this.state.clock) {
        this.state.clock.cancel();
      }

      const type = timerType === "Session" ? "Break" : "Session";
      const len =
        timerType === "Session" ? this.state.bkLen : this.state.sessionLen;

      this.beginCntDwn();
      this.toTimer(len * 60, type);
    }
  }

  warn(time) {
    if (time < 61) {
      this.setState({ alarmClass: "border border-secondary bg-info text-danger" });
    } else if (time < 121) {
      this.setState({ alarmClass: "border border-secondary bg-primary text-warning" });
    } else {
      this.setState({ alarmClass: "border border-secondary bg-info text-white" });
    }
  }

  buzz(time) {
    if (time === 0) {
      this.beep.play();
    }
  }

  toTimer(time, type) {
    this.setState({
      timer: time,
      timerType: type,
      alarmColor: "border border-secondary bg-info text-white"
    });
  }

  reset() {
    this.setState({
      bkLen: 5,
      sessionLen: 25,
      btnClass: "fas fa-play fa-2x text-success",
      started: false,
      timerType: "Session",
      timer: 1500,
      clock: null,
      alarmClass: "border border-secondary bg-info text-white"
    });

    if (this.state.clock) {
      this.state.clock.cancel();
    }

    this.beep.pause();
    this.beep.currentTime = 0;
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-around col">
          <LengthControl
            label="break-label"
            hdg="Break Length"
            lenId="break-length"
            inc="break-increment"
            dec="break-decrement"
            len={this.state.bkLen}
            onClick={this.setBkLen}
          />

          <div id="timer-container">
            <div id="timer" className={this.state.alarmClass}>
              <p id="timer-label" className="m-0">
                {this.state.timerType}
              </p>
              <p id="time-left" className="m-0">
                {this.formatTime()}
              </p>
            </div>

            <div id="controls" className="bg-dark p-2">
              <button
                id="start_stop"
                className="bg-transparent"
                onClick={this.playCheck}
              >
                <i className={this.state.btnClass}></i>
              </button>
              <button
                id="reset"
                className="bg-transparent"
                onClick={this.reset}
              >
                <i className="fas fa-sync fa-2x text-light"></i>
              </button>
            </div>
          </div>

          <LengthControl
            label="session-label"
            hdg="Session Length"
            lenId="session-length"
            inc="session-increment"
            dec="session-decrement"
            len={this.state.sessionLen}
            onClick={this.setSessionLen}
          />
        </div>

        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.beep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

export default Timer;