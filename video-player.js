class VideoPlayer {
    constructor(element) {
        this.video = element.querySelector('video');
        this.controls = {
            fullscreen: element.querySelector('[data-video-control="fullscreen"]'),
            togglePlay: element.querySelectorAll('[data-video-control="toggle-play"]'),
            currentTime: element.querySelectorAll('[data-video-control="time-current"]'),
            totalTime: element.querySelectorAll('[data-video-control="time-total"]'),
            timeline: element.querySelector('[data-video-control="timeline"]'),
            volume: element.querySelectorAll('[data-video-control="volume"]'),
            volumeBar: element.querySelector('[data-video-control="volume-bar"]'),
            buffer: element.querySelector('[data-video-control="buffer"]'),

            // Add other controls as needed
        };

        this.controls.volumeBarHandle = this.controls.volumeBar.firstElementChild

        this.controls.timelineHandle = this.controls.timeline.firstElementChild;

        this.draggingTimeline = false;

        this.hoverTimeout = null;

        this.previousVolume = this.video.volume;
        this.bindEvents();
    }

    openFullscreen() {
        if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.mozRequestFullScreen) { /* Firefox */
            this.video.mozRequestFullScreen();
        } else if (this.video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            this.video.webkitRequestFullscreen();
        } else if (this.video.msRequestFullscreen) { /* IE/Edge */
            this.video.msRequestFullscreen();
        }
    }

    bindEvents() {

        this.video.addEventListener('play', () => {
            this.controls.togglePlay.forEach(control => {
                if (control.children.length === 2) {
                    control.children[0].style.display = 'none';
                    control.children[1].style.display = 'flex';
                }
            });
        });

        this.video.addEventListener('pause', () => {
            this.controls.togglePlay.forEach(control => {
                if (control.children.length === 2) {
                    control.children[0].style.display = 'flex';
                    control.children[1].style.display = 'none';
                }
            });
        });

        this.controls.togglePlay.forEach(control => {
            control.addEventListener('click', () => {
                if (this.video.paused) {
                    this.video.play();
                } else {
                    this.video.pause();
                }
            });
        });

        this.controls.volume.forEach(control => {
            control.addEventListener('click', () => {
                if (this.video.volume > 0) {
                    this.previousVolume = this.video.volume;
                    this.video.volume = 0;
                } else {
                    this.video.volume = this.previousVolume;
                }
            });
        });

        this.video.addEventListener('timeupdate', () => {
            this.updateTime();
            if (!this.draggingTimeline) {
                this.controls.timelineHandle.style.width = `${(this.video.currentTime / this.video.duration) * 100}%`;
            }
        });

        this.controls.fullscreen.addEventListener('click', () => {
            this.openFullscreen();
        });

        this.controls.volumeBar.addEventListener('mousedown', (event) => {
            this.draggingVolume = true;
            this.updateVolume(event);
        });

        this.controls.volumeBar.addEventListener('mousemove', (event) => {
            if (!this.draggingVolume) return;
            this.updateVolume(event);
        });

        this.controls.volumeBar.addEventListener('mouseup', () => {
            this.draggingVolume = false;
        });

        this.controls.volumeBar.addEventListener('mouseleave', () => {
            this.draggingVolume = false;
        });

        this.video.addEventListener('progress', () => {
            this.updateBuffer();
        });

        this.controls.timeline.addEventListener('mousedown', (event) => {
            this.draggingTimeline = true;
            this.updateTimeline(event);
        });

        this.controls.timeline.addEventListener('mousemove', (event) => {
            if (!this.draggingTimeline) return;
            this.updateTimeline(event);
        });

        this.controls.timeline.addEventListener('mouseup', () => {
            this.draggingTimeline = false;
        });

        this.controls.timeline.addEventListener('mouseleave', () => {
            this.draggingTimeline = false;
        });

        this.video.addEventListener('volumechange', () => {
            if (this.video.muted) {
                this.controls.volumeBarHandle.style.width = '0%';
            } else {
                this.controls.volumeBarHandle.style.width = `${this.video.volume * 100}%`;
            }
        });

        this.video.addEventListener('volumechange', () => {
            if (this.video.muted || this.video.volume === 0) {
                this.controls.volume.forEach(control => {
                    control.style.color = 'transparent';
                });
            } else {
                this.controls.volume.forEach(control => {
                    control.style.color = ''; // Reset to original color
                });
            }
        });
    }

    updateVolume(event) {
        const rect = this.controls.volumeBar.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const volume = x / rect.width;
        this.video.volume = volume;
        this.controls.volumeBarHandle.style.width = `${volume * 100}%`;
    }

    updateTime() {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        const currentTime = formatTime(this.video.currentTime);
        const totalTime = formatTime(this.video.duration);

        this.controls.currentTime.forEach(control => control.innerHTML = currentTime);
        this.controls.totalTime.forEach(control => control.innerHTML = totalTime);
    }

    updateBuffer() {
        if (this.video.buffered.length > 0) {
            const bufferEnd = this.video.buffered.end(this.video.buffered.length - 1);
            const bufferPercent = bufferEnd / this.video.duration * 100;
            this.controls.buffer.style.width = `${bufferPercent}%`;
        }
    }

    updateTimeline(event) {
        const rect = this.controls.timeline.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const currentTime = x / rect.width * this.video.duration;
        this.video.currentTime = currentTime;
        this.controls.timelineHandle.style.width = `${(currentTime / this.video.duration) * 100}%`;
    }
}

// Initialize video players
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-video-player]').forEach(element => {
        const player = new VideoPlayer(element);
        // player.addHoverListeners();
    });
});
