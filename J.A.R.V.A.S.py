import base64
import math
import shutil
import subprocess
import threading
import tkinter as tk
from tkinter import ttk


TASKS = {
    "Standby": {
        "shape": "circle",
        "color": "#56e8ff",
        "message": "All systems standing by. What can I do for you?",
    },
    "Analyze": {
        "shape": "hexagon",
        "color": "#49a8ff",
        "message": "Analysis mode engaged. Let's look at the data.",
    },
    "Create": {
        "shape": "star",
        "color": "#c17aff",
        "message": "Creative mode engaged. Let's make something brilliant.",
    },
    "Focus": {
        "shape": "square",
        "color": "#ffbd59",
        "message": "Focus mode engaged. One thing at a time.",
    },
    "Communicate": {
        "shape": "diamond",
        "color": "#5dffc2",
        "message": "Communications are online. I'm listening.",
    },
    "Celebrate": {
        "shape": "burst",
        "color": "#ff6d9e",
        "message": "Celebration mode! You deserve it.",
    },
}

BACKGROUND = "#07111f"
PANEL = "#0d1b2b"
MUTED = "#7891a8"
WHITE = "#e9f6ff"


class JarvisApp:
    def __init__(self, root):
        self.root = root
        self.root.title("J.A.R.V.A.S. | Personal Holographic Assistant")
        self.root.geometry("920x760")
        self.root.minsize(780, 680)
        self.root.configure(bg=BACKGROUND)

        self.task_name = tk.StringVar(value="Standby")
        self.voice_gender = tk.StringVar(value="Female")
        self.status_text = tk.StringVar(value="SYSTEM ONLINE  •  HOLOGRAM READY")
        self.angle = 0.0
        self.pulse = 0.0
        self.particles = [
            (
                (index * 97 + 31) % 1000 / 1000,
                (index * 173 + 59) % 1000 / 1000,
                index % 3 + 1,
                index * 0.71,
            )
            for index in range(38)
        ]

        self._build_interface()
        self._set_task("Standby")
        self._animate()

    def _build_interface(self):
        header = tk.Frame(self.root, bg=BACKGROUND)
        header.pack(fill="x", padx=34, pady=(24, 12))

        tk.Label(
            header,
            text="J.A.R.V.A.S.",
            bg=BACKGROUND,
            fg=WHITE,
            font=("Segoe UI", 25, "bold"),
        ).pack(side="left")
        tk.Label(
            header,
            text="PERSONAL HOLOGRAPHIC ASSISTANT",
            bg=BACKGROUND,
            fg=MUTED,
            font=("Segoe UI", 9, "bold"),
        ).pack(side="left", padx=(15, 0), pady=(10, 0))
        tk.Label(
            header,
            text="●  ONLINE",
            bg=BACKGROUND,
            fg="#5dffc2",
            font=("Segoe UI", 9, "bold"),
        ).pack(side="right", pady=(10, 0))

        self.canvas = tk.Canvas(
            self.root,
            bg=BACKGROUND,
            highlightthickness=1,
            highlightbackground="#19334b",
        )
        self.canvas.pack(fill="both", expand=True, padx=34, pady=8)

        controls = tk.Frame(self.root, bg=PANEL, highlightthickness=1, highlightbackground="#19334b")
        controls.pack(fill="x", padx=34, pady=(8, 0))

        top_row = tk.Frame(controls, bg=PANEL)
        top_row.pack(fill="x", padx=20, pady=(17, 10))
        tk.Label(
            top_row,
            text="ACTIVE PROTOCOL",
            bg=PANEL,
            fg=MUTED,
            font=("Segoe UI", 9, "bold"),
        ).pack(side="left")

        self.task_menu = ttk.Combobox(
            top_row,
            textvariable=self.task_name,
            values=tuple(TASKS),
            state="readonly",
            width=19,
            font=("Segoe UI", 10),
        )
        self.task_menu.pack(side="left", padx=(12, 24))
        self.task_menu.bind("<<ComboboxSelected>>", self._on_task_selected)

        tk.Label(
            top_row,
            text="VOICE",
            bg=PANEL,
            fg=MUTED,
            font=("Segoe UI", 9, "bold"),
        ).pack(side="left")
        for gender in ("Female", "Male"):
            tk.Radiobutton(
                top_row,
                text=gender,
                variable=self.voice_gender,
                value=gender,
                bg=PANEL,
                fg=WHITE,
                activebackground=PANEL,
                activeforeground=WHITE,
                selectcolor=BACKGROUND,
                font=("Segoe UI", 10),
                cursor="hand2",
            ).pack(side="left", padx=(8, 0))

        bottom_row = tk.Frame(controls, bg=PANEL)
        bottom_row.pack(fill="x", padx=20, pady=(4, 17))
        tk.Label(
            bottom_row,
            textvariable=self.status_text,
            bg=PANEL,
            fg="#56e8ff",
            font=("Consolas", 9),
            anchor="w",
        ).pack(side="left", fill="x", expand=True)

        self.engage_button = tk.Button(
            bottom_row,
            text="▶  ENGAGE",
            command=self._engage,
            bg="#12384b",
            fg="#8cf2ff",
            activebackground="#1d566b",
            activeforeground=WHITE,
            relief="flat",
            bd=0,
            padx=23,
            pady=11,
            font=("Segoe UI", 10, "bold"),
            cursor="hand2",
        )
        self.engage_button.pack(side="right")

        tk.Label(
            self.root,
            text="Choose a protocol to transform the hologram  •  Select a voice, then engage",
            bg=BACKGROUND,
            fg="#526c83",
            font=("Segoe UI", 9),
        ).pack(pady=(10, 18))

    def _on_task_selected(self, _event=None):
        self._set_task(self.task_name.get())

    def _set_task(self, name):
        task = TASKS[name]
        self.color = task["color"]
        self.shape = task["shape"]
        self.status_text.set(f"{name.upper()} PROTOCOL  •  HOLOGRAM CONFIGURED")

    def _engage(self):
        name = self.task_name.get()
        self.status_text.set(f"{name.upper()} PROTOCOL  •  VOICE RESPONSE STARTING")
        self.engage_button.configure(state="disabled")
        threading.Thread(
            target=self._speak,
            args=(self.voice_gender.get(), name, TASKS[name]["message"]),
            daemon=True,
        ).start()

    def _speak(self, gender, task_name, message):
        powershell = shutil.which("powershell.exe")
        if powershell is None:
            self.root.after(
                0,
                self._speech_finished,
                "Speech unavailable: Windows PowerShell was not found.",
            )
            return

        gender_name = "Female" if gender == "Female" else "Male"
        message_data = base64.b64encode(message.encode("utf-8")).decode("ascii")
        script = (
            "Add-Type -AssemblyName System.Speech; "
            "$gender = [System.Speech.Synthesis.VoiceGender]::"
            f"{gender_name}; "
            "$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
            "$voice = $synth.GetInstalledVoices() | "
            "Where-Object { $_.VoiceInfo.Gender -eq $gender } | "
            "Select-Object -First 1; "
            "if ($null -eq $voice) { "
            f"Write-Error 'No {gender_name.lower()} voice is installed.'; exit 2 "
            "}; "
            "$synth.SelectVoice($voice.VoiceInfo.Name); "
            f"$text = [Text.Encoding]::UTF8.GetString("
            f"[Convert]::FromBase64String('{message_data}')); "
            "$synth.Speak($text)"
        )
        encoded_script = base64.b64encode(script.encode("utf-16-le")).decode("ascii")

        try:
            result = subprocess.run(
                [powershell, "-NoProfile", "-NonInteractive", "-EncodedCommand", encoded_script],
                capture_output=True,
                text=True,
                timeout=30,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                check=False,
            )
        except subprocess.TimeoutExpired:
            feedback = "Speech timed out. Please try again."
        except OSError as error:
            feedback = f"Speech could not start: {error}"
        else:
            if result.returncode == 0:
                feedback = f"{gender_name.upper()} VOICE ACTIVE  •  {task_name.upper()} COMPLETE"
            else:
                detail = result.stderr.strip() or result.stdout.strip()
                feedback = f"Speech unavailable: {detail or 'PowerShell speech failed.'}"

        self.root.after(0, self._speech_finished, feedback)

    def _speech_finished(self, feedback):
        self.status_text.set(feedback[:100])
        self.engage_button.configure(state="normal")

    def _animate(self):
        self.angle = (self.angle + 0.035) % (2 * math.pi)
        self.pulse = (self.pulse + 0.055) % (2 * math.pi)
        self._draw_hologram()
        self.root.after(33, self._animate)

    def _draw_hologram(self):
        canvas = self.canvas
        canvas.delete("all")
        width = max(canvas.winfo_width(), 1)
        height = max(canvas.winfo_height(), 1)
        center_x, center_y = width / 2, height / 2
        color = self.color

        for fraction in (0.18, 0.38, 0.62, 0.82):
            x = width * fraction
            y = height * fraction
            canvas.create_line(x, 0, x, height, fill="#0b2031")
            canvas.create_line(0, y, width, y, fill="#0b2031")

        for x_pos, y_pos, radius, phase in self.particles:
            twinkle = 0.5 + 0.5 * math.sin(self.pulse + phase)
            x = x_pos * width
            y = y_pos * height
            size = radius * (0.7 + twinkle * 0.7)
            canvas.create_oval(
                x - size,
                y - size,
                x + size,
                y + size,
                fill=color if twinkle > 0.82 else "#31506a",
                outline="",
            )

        base_radius = min(width, height) * 0.235
        breathing = 1 + 0.035 * math.sin(self.pulse)
        radius = base_radius * breathing

        canvas.create_oval(
            center_x - radius * 1.55,
            center_y - radius * 1.55,
            center_x + radius * 1.55,
            center_y + radius * 1.55,
            outline="#17394a",
            width=1,
        )
        canvas.create_oval(
            center_x - radius * 1.32,
            center_y - radius * 1.32,
            center_x + radius * 1.32,
            center_y + radius * 1.32,
            outline=color,
            width=1,
            dash=(3, 8),
        )
        canvas.create_oval(
            center_x - radius * 1.12,
            center_y - radius * 1.12,
            center_x + radius * 1.12,
            center_y + radius * 1.12,
            outline=color,
            width=2,
        )

        orbit_angle = self.angle * 1.7
        orbit_x = center_x + math.cos(orbit_angle) * radius * 1.34
        orbit_y = center_y + math.sin(orbit_angle) * radius * 1.34
        canvas.create_oval(
            orbit_x - 5,
            orbit_y - 5,
            orbit_x + 5,
            orbit_y + 5,
            fill=WHITE,
            outline=color,
            width=2,
        )

        shape_radius = radius * 0.69
        if self.shape == "circle":
            canvas.create_oval(
                center_x - shape_radius,
                center_y - shape_radius,
                center_x + shape_radius,
                center_y + shape_radius,
                fill="#0b2234",
                outline=color,
                width=4,
            )
        else:
            sides = {"hexagon": 6, "square": 4, "diamond": 4, "star": 10, "burst": 16}[
                self.shape
            ]
            points = []
            for index in range(sides):
                point_angle = self.angle + (2 * math.pi * index / sides) - math.pi / 2
                point_radius = shape_radius
                if self.shape == "diamond":
                    point_angle = self.angle + math.pi / 4 + math.pi * index / 2
                elif self.shape == "star" and index % 2 == 1:
                    point_radius *= 0.43
                elif self.shape == "burst" and index % 2 == 1:
                    point_radius *= 0.52
                points.extend(
                    (
                        center_x + math.cos(point_angle) * point_radius,
                        center_y + math.sin(point_angle) * point_radius,
                    )
                )
            canvas.create_polygon(
                points,
                fill="#0b2234",
                outline=color,
                width=4,
                joinstyle=tk.ROUND,
            )

        canvas.create_text(
            center_x,
            center_y - 6,
            text="J",
            fill=WHITE,
            font=("Segoe UI Light", max(28, int(radius * 0.65)), "bold"),
        )
        canvas.create_text(
            center_x,
            center_y + radius * 0.92,
            text=f"{self.task_name.get().upper()}  /  {self.shape.upper()}",
            fill=color,
            font=("Consolas", 10, "bold"),
        )

        status_y = height - 28
        canvas.create_text(
            18,
            status_y,
            text="NEURAL CORE  •  ACTIVE",
            fill="#58758d",
            font=("Consolas", 8),
            anchor="w",
        )
        canvas.create_text(
            width - 18,
            status_y,
            text="HOLOGRAM RENDER  //  LIVE",
            fill="#58758d",
            font=("Consolas", 8),
            anchor="e",
        )


def main():
    root = tk.Tk()
    JarvisApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()