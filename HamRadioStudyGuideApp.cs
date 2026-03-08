using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace HamRadioStudyGuideApp
{
    internal static class Program
    {
        [STAThread]
        private static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }

    internal sealed class MainForm : Form
    {
        public MainForm()
        {
            Text = "Stumpwizards Ham Study Guide";
            ClientSize = new Size(1024, 720);
            StartPosition = FormStartPosition.CenterScreen;

            var tabs = new TabControl();
            tabs.Dock = DockStyle.Fill;
            tabs.TabPages.Add(BuildGuidePage());
            tabs.TabPages.Add(BuildExamPage(ExamData.Exam1));
            tabs.TabPages.Add(BuildExamPage(ExamData.Exam2));
            tabs.TabPages.Add(BuildExamPage(ExamData.Exam3));
            Controls.Add(tabs);
        }

        private TabPage BuildGuidePage()
        {
            var page = new TabPage("Study Guide");
            var box = new RichTextBox();
            box.Dock = DockStyle.Fill;
            box.ReadOnly = true;
            box.Font = new Font("Consolas", 10F);
            box.Text = LoadGuideText();
            page.Controls.Add(box);
            return page;
        }

        private string LoadGuideText()
        {
            try
            {
                var path = Path.Combine(Application.StartupPath, "ham-radio-study-guide.md");
                if (File.Exists(path))
                {
                    return File.ReadAllText(path);
                }
            }
            catch
            {
            }

            return "ham-radio-study-guide.md was not found next to the executable.";
        }

        private TabPage BuildExamPage(Exam exam)
        {
            var page = new TabPage(exam.Title);
            var root = new TableLayoutPanel();
            root.Dock = DockStyle.Fill;
            root.ColumnCount = 1;
            root.RowCount = 3;
            root.Padding = new Padding(10);
            root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            root.RowStyles.Add(new RowStyle(SizeType.Percent, 100F));
            root.RowStyles.Add(new RowStyle(SizeType.AutoSize));

            var heading = new Label();
            heading.Text = exam.Title + "\r\n" + exam.Description;
            heading.AutoSize = true;
            heading.Font = new Font("Segoe UI", 11F, FontStyle.Bold);

            var scroll = new Panel();
            scroll.Dock = DockStyle.Fill;
            scroll.AutoScroll = true;

            var stack = new FlowLayoutPanel();
            stack.Dock = DockStyle.Top;
            stack.AutoSize = true;
            stack.FlowDirection = FlowDirection.TopDown;
            stack.WrapContents = false;

            int i;
            for (i = 0; i < exam.Questions.Count; i++)
            {
                stack.Controls.Add(BuildQuestionPanel(exam.Questions[i]));
            }
            scroll.Controls.Add(stack);

            var actions = new FlowLayoutPanel();
            actions.AutoSize = true;

            var score = new Button();
            score.Text = "Score Exam";
            score.AutoSize = true;

            var reset = new Button();
            reset.Text = "Reset";
            reset.AutoSize = true;

            var result = new Label();
            result.AutoSize = true;
            result.Padding = new Padding(12, 8, 0, 0);

            score.Click += delegate { ScoreExam(exam, result); };
            reset.Click += delegate { ResetExam(exam, result); };

            actions.Controls.Add(score);
            actions.Controls.Add(reset);
            actions.Controls.Add(result);

            root.Controls.Add(heading, 0, 0);
            root.Controls.Add(scroll, 0, 1);
            root.Controls.Add(actions, 0, 2);
            page.Controls.Add(root);
            return page;
        }

        private Control BuildQuestionPanel(Question question)
        {
            var panel = new Panel();
            panel.Width = 940;
            panel.Height = 160;
            panel.BorderStyle = BorderStyle.FixedSingle;
            panel.Margin = new Padding(0, 0, 0, 10);

            var label = new Label();
            label.Text = question.Number + ". " + question.Prompt;
            label.Location = new Point(10, 10);
            label.Width = 900;
            label.Height = 32;
            label.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            panel.Controls.Add(label);

            int y = 45;
            int i;
            for (i = 0; i < question.Options.Count; i++)
            {
                var option = question.Options[i];
                var radio = new RadioButton();
                radio.Text = option.Key + ". " + option.Value;
                radio.Location = new Point(14, y);
                radio.AutoSize = true;
                radio.Tag = option.Key;
                question.Buttons.Add(radio);
                panel.Controls.Add(radio);
                y += 22;
            }

            var feedback = new Label();
            feedback.Location = new Point(14, 132);
            feedback.Width = 900;
            feedback.Height = 22;
            feedback.ForeColor = Color.Firebrick;
            feedback.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            feedback.Text = string.Empty;
            panel.Controls.Add(feedback);
            question.FeedbackLabel = feedback;

            return panel;
        }

        private void ScoreExam(Exam exam, Label result)
        {
            int answered = 0;
            int correct = 0;
            int i;
            int j;
            for (i = 0; i < exam.Questions.Count; i++)
            {
                var question = exam.Questions[i];
                RadioButton selected = null;
                for (j = 0; j < question.Buttons.Count; j++)
                {
                    if (question.Buttons[j].Checked)
                    {
                        selected = question.Buttons[j];
                        break;
                    }
                }

                if (selected != null)
                {
                    answered++;
                    if ((string)selected.Tag == question.Answer)
                    {
                        correct++;
                        question.FeedbackLabel.ForeColor = Color.ForestGreen;
                        question.FeedbackLabel.Text = "Correct";
                    }
                    else
                    {
                        question.FeedbackLabel.ForeColor = Color.Firebrick;
                        question.FeedbackLabel.Text = "Missed. Correct answer: " + question.Answer + ". " + GetOptionText(question, question.Answer);
                    }
                }
                else
                {
                    question.FeedbackLabel.ForeColor = Color.Firebrick;
                    question.FeedbackLabel.Text = "Unanswered. Correct answer: " + question.Answer + ". " + GetOptionText(question, question.Answer);
                }
            }

            int percent = (int)Math.Round((double)correct * 100.0 / exam.Questions.Count);
            result.Text = string.Format("Answered {0}/{1}  Score {2}/{1}  {3}%", answered, exam.Questions.Count, correct, percent);
        }

        private void ResetExam(Exam exam, Label result)
        {
            int i;
            int j;
            for (i = 0; i < exam.Questions.Count; i++)
            {
                for (j = 0; j < exam.Questions[i].Buttons.Count; j++)
                {
                    exam.Questions[i].Buttons[j].Checked = false;
                }
                exam.Questions[i].FeedbackLabel.Text = string.Empty;
            }
            result.Text = string.Empty;
        }

        private string GetOptionText(Question question, string key)
        {
            int i;
            for (i = 0; i < question.Options.Count; i++)
            {
                if (question.Options[i].Key == key)
                {
                    return question.Options[i].Value;
                }
            }
            return string.Empty;
        }
    }

    internal sealed class Exam
    {
        public string Title;
        public string Description;
        public List<Question> Questions;

        public Exam(string title, string description, List<Question> questions)
        {
            Title = title;
            Description = description;
            Questions = questions;
        }
    }

    internal sealed class Question
    {
        public int Number;
        public string Prompt;
        public string Answer;
        public List<Option> Options;
        public List<RadioButton> Buttons;
        public Label FeedbackLabel;

        public Question(int number, string prompt, string answer, List<Option> options)
        {
            Number = number;
            Prompt = prompt;
            Answer = answer;
            Options = options;
            Buttons = new List<RadioButton>();
        }
    }

    internal sealed class Option
    {
        public string Key;
        public string Value;

        public Option(string key, string value)
        {
            Key = key;
            Value = value;
        }
    }

    internal static class ExamData
    {
        private static Option O(string key, string value)
        {
            return new Option(key, value);
        }

        private static Question Q(int number, string prompt, string answer, params Option[] options)
        {
            return new Question(number, prompt, answer, new List<Option>(options));
        }

        public static readonly Exam Exam1 = new Exam(
            "Exam 1",
            "Technician fundamentals.",
            new List<Question>
            {
                Q(1, "What is the main purpose of a repeater?", "B", O("A", "Encrypt traffic"), O("B", "Extend communication range"), O("C", "Reduce current draw"), O("D", "Replace the antenna")),
                Q(2, "What does your amateur call sign do?", "B", O("A", "Tunes the antenna"), O("B", "Identifies your station"), O("C", "Measures output power"), O("D", "Selects the band")),
                Q(3, "What does V = I x R describe?", "C", O("A", "Polarization"), O("B", "Velocity factor"), O("C", "Ohm's Law"), O("D", "SWR")),
                Q(4, "Which mode is common on local VHF/UHF repeaters?", "A", O("A", "FM"), O("B", "SSB"), O("C", "CW only"), O("D", "AM only")),
                Q(5, "If frequency increases, wavelength does what?", "B", O("A", "Increases"), O("B", "Decreases"), O("C", "Stays constant"), O("D", "Becomes DC")),
                Q(6, "What does SWR primarily indicate?", "C", O("A", "Battery capacity"), O("B", "Audio deviation"), O("C", "Antenna-system match quality"), O("D", "Cable age")),
                Q(7, "Which practice is best before transmitting?", "B", O("A", "Increase power"), O("B", "Listen first"), O("C", "Disable mic gain"), O("D", "Shift bands")),
                Q(8, "A capacitor stores energy in what?", "C", O("A", "Magnetic field"), O("B", "Rotating field"), O("C", "Electric field"), O("D", "Sound wave")),
                Q(9, "Which item most directly protects against overcurrent?", "A", O("A", "Fuse"), O("B", "Microphone"), O("C", "Wattmeter"), O("D", "Dummy load")),
                Q(10, "Which band type is associated with long-distance skywave communication?", "A", O("A", "HF"), O("B", "Audio"), O("C", "Microwave oven only"), O("D", "DC")),
                Q(11, "What is the control operator responsible for?", "B", O("A", "Station appearance only"), O("B", "Proper station operation"), O("C", "Internet speed"), O("D", "Weather forecasting")),
                Q(12, "What is the safest action when installing an outdoor antenna?", "C", O("A", "Place it close to power lines"), O("B", "Work alone in a storm"), O("C", "Keep clear of power lines"), O("D", "Use damaged feed line")),
                Q(13, "Power is measured in what unit?", "C", O("A", "Amperes"), O("B", "Ohms"), O("C", "Watts"), O("D", "Farads")),
                Q(14, "A diode primarily does what?", "B", O("A", "Amplifies all signals"), O("B", "Allows current mainly one way"), O("C", "Stores RF in the mast"), O("D", "Converts coax to ladder line")),
                Q(15, "Why might a repeater require a CTCSS tone?", "B", O("A", "Reduce lightning risk"), O("B", "Access the repeater"), O("C", "Calculate wavelength"), O("D", "Improve Morse speed")),
                Q(16, "Which statement about low SWR is best?", "C", O("A", "Guarantees worldwide contacts"), O("B", "Means ideal antenna height"), O("C", "Usually indicates a better impedance match"), O("D", "Eliminates feed line loss")),
                Q(17, "What is a major use of phonetics on the air?", "B", O("A", "Increase transmitter power"), O("B", "Make call signs easier to copy"), O("C", "Hide station identity"), O("D", "Change modulation type")),
                Q(18, "Which quantity opposes current flow?", "B", O("A", "Frequency"), O("B", "Resistance"), O("C", "Velocity factor"), O("D", "Modulation index")),
                Q(19, "What should you do if you cause interference?", "C", O("A", "Ignore it"), O("B", "Continue until two complaints"), O("C", "Investigate and correct it"), O("D", "Move randomly without listening")),
                Q(20, "What is one likely risk of replacing a fuse with too high a rating?", "C", O("A", "Better audio"), O("B", "Improved antenna match"), O("C", "Equipment damage or fire"), O("D", "Lower RF exposure"))
            });

        public static readonly Exam Exam2 = new Exam(
            "Exam 2",
            "General-level operating and propagation.",
            new List<Question>
            {
                Q(1, "Why upgrade from Technician to General?", "B", O("A", "No antenna needed"), O("B", "Broader HF privileges"), O("C", "Avoid ID"), O("D", "Use commercial frequencies")),
                Q(2, "What often changes HF propagation from day to night?", "B", O("A", "Display color"), O("B", "Ionospheric conditions"), O("C", "Microphone brand"), O("D", "Label size")),
                Q(3, "Which voice mode is commonly used on HF for bandwidth efficiency?", "A", O("A", "SSB"), O("B", "Wideband FM"), O("C", "Analog TV"), O("D", "Tone burst")),
                Q(4, "One advantage of CW is what?", "B", O("A", "No skill required"), O("B", "Works under weak-signal conditions"), O("C", "Always carries images"), O("D", "Uses more bandwidth")),
                Q(5, "What usually happens to coax loss as frequency increases?", "B", O("A", "Goes to zero"), O("B", "Generally increases"), O("C", "Becomes negative"), O("D", "Depends on mic gain")),
                Q(6, "Why is a band plan useful?", "B", O("A", "Replaces FCC rules"), O("B", "Helps use accepted subbands"), O("C", "Sets utility rates"), O("D", "Tunes the antenna")),
                Q(7, "What is a dummy load used for?", "B", O("A", "Stronger signal"), O("B", "Test without significant radiation"), O("C", "Improve mic tone"), O("D", "Replace a fuse")),
                Q(8, "Digital modes can be used for what?", "B", O("A", "Government only"), O("B", "Text, data, and weak-signal work"), O("C", "Satellite only"), O("D", "Not HF")),
                Q(9, "If a 12-volt circuit draws 2 amperes, what power is used?", "C", O("A", "6 watts"), O("B", "12 watts"), O("C", "24 watts"), O("D", "48 watts")),
                Q(10, "What is the best response if unsure a transmission is within your privileges?", "C", O("A", "Transmit first"), O("B", "Use maximum power"), O("C", "Verify privileges first"), O("D", "Let a friend transmit")),
                Q(11, "Which item best helps protect equipment from nearby lightning energy?", "A", O("A", "Proper grounding and lightning protection"), O("B", "Louder audio"), O("C", "Desk lamp"), O("D", "Lower Morse speed")),
                Q(12, "What does a transformer commonly do?", "C", O("A", "Stores charge chemically"), O("B", "Converts RF into sound"), O("C", "Transfers energy between windings"), O("D", "Measures SWR")),
                Q(13, "Why is listening before calling CQ important?", "B", O("A", "Reduces antenna size"), O("B", "Avoids interfering with ongoing contacts"), O("C", "Increases battery voltage"), O("D", "Changes the band edge")),
                Q(14, "Which condition most affects VHF/UHF line-of-sight coverage?", "A", O("A", "Antenna height"), O("B", "Keyboard layout"), O("C", "Call sign suffix"), O("D", "Power supply paint color")),
                Q(15, "What is one common purpose of a tuner or matching network?", "B", O("A", "Create AC power from sunlight"), O("B", "Help match the transmitter system to the load"), O("C", "Replace station identification"), O("D", "Increase license class")),
                Q(16, "Which operating habit is most professional during a busy net?", "B", O("A", "Long unbroken transmissions"), O("B", "Clear, concise transmissions with pauses"), O("C", "Refuse to identify"), O("D", "Tune up on the active frequency")),
                Q(17, "What does polarization describe?", "A", O("A", "Orientation of the electric field"), O("B", "Battery chemistry only"), O("C", "Age of the antenna"), O("D", "Number of repeaters")),
                Q(18, "What can result from poor grounding or unsafe wiring?", "B", O("A", "Reduced need for ID"), O("B", "Shock hazard and equipment damage"), O("C", "Automatic Extra privileges"), O("D", "Lower ionospheric absorption")),
                Q(19, "What is most likely to improve weak-signal fixed-station performance?", "A", O("A", "Better antenna placement"), O("B", "Cover the radio with cloth"), O("C", "Longest microphone cable possible"), O("D", "Lower the antenna behind a shed")),
                Q(20, "Why may lower HF bands be preferred at night?", "B", O("A", "Night makes all antennas resonant"), O("B", "Propagation can favor lower frequencies"), O("C", "FM becomes mandatory"), O("D", "Repeaters stop requiring offsets"))
            });

        public static readonly Exam Exam3 = new Exam(
            "Exam 3",
            "Mixed review.",
            new List<Question>
            {
                Q(1, "What is the basic role of an antenna?", "A", O("A", "Convert RF energy to radio waves and back"), O("B", "Lower house voltage"), O("C", "Replace feed line"), O("D", "Store logs")),
                Q(2, "What unit measures resistance?", "C", O("A", "Watt"), O("B", "Volt"), O("C", "Ohm"), O("D", "Second")),
                Q(3, "What does an inductor store energy in?", "B", O("A", "Electric field"), O("B", "Magnetic field"), O("C", "Display"), O("D", "Fuse element")),
                Q(4, "What is the major hazard when raising an antenna mast?", "B", O("A", "Call sign prefixes"), O("B", "Overhead power lines"), O("C", "Notebook paper"), O("D", "Phonetics")),
                Q(5, "HF often supports long-distance contacts by what means?", "B", O("A", "DC conduction"), O("B", "Ionospheric propagation"), O("C", "Fuse action"), O("D", "Battery chemistry")),
                Q(6, "A 10-ohm load with 2 amperes has what voltage?", "C", O("A", "5 volts"), O("B", "10 volts"), O("C", "20 volts"), O("D", "40 volts")),
                Q(7, "What does a higher antenna often improve on VHF/UHF?", "A", O("A", "Line-of-sight coverage"), O("B", "Fuse speed"), O("C", "Battery chemistry"), O("D", "ID interval")),
                Q(8, "Why avoid tuning up on an occupied frequency?", "B", O("A", "It wastes electricity only"), O("B", "It can interfere with ongoing communications"), O("C", "It is required for nets"), O("D", "It improves propagation too much")),
                Q(9, "Which statement best describes FM on amateur repeaters?", "A", O("A", "Common for local voice communication"), O("B", "Banned on VHF"), O("C", "Used only for Morse code"), O("D", "Never requires offset")),
                Q(10, "Which practice helps reduce accidental repeater interference?", "B", O("A", "Transmit immediately after keying up"), O("B", "Pause briefly after pressing PTT"), O("C", "Ignore courtesy tones"), O("D", "Use the wrong offset")),
                Q(11, "If current increases in a fixed resistance, voltage does what?", "A", O("A", "Also increases by Ohm's Law"), O("B", "Becomes zero"), O("C", "Always becomes AC"), O("D", "No longer matters")),
                Q(12, "Why might signal reports be weak even with low SWR?", "A", O("A", "Antenna placement or efficiency may still be poor"), O("B", "Low SWR guarantees strong signals"), O("C", "Mic has too many buttons"), O("D", "Call sign is too short")),
                Q(13, "What is the most responsible action if equipment smells hot?", "B", O("A", "Keep transmitting"), O("B", "Disconnect power and investigate safely"), O("C", "Increase power"), O("D", "Bypass protection")),
                Q(14, "What is the main purpose of station identification rules?", "B", O("A", "Obscure the source of signals"), O("B", "Identify transmitting stations"), O("C", "Replace logging in every case"), O("D", "Determine solar flux")),
                Q(15, "Which statement about digital communication is true?", "A", O("A", "It can include data and weak-signal modes"), O("B", "It is not radio"), O("C", "It always uses voice microphones"), O("D", "It cannot coexist with band planning")),
                Q(16, "What is one likely result of replacing a fuse with a higher-rated one?", "C", O("A", "Better audio quality"), O("B", "Improved antenna match"), O("C", "Higher risk of damage or fire"), O("D", "Lower RF exposure")),
                Q(17, "What does your call sign identify?", "B", O("A", "Only your antenna"), O("B", "Your station"), O("C", "Only your power supply"), O("D", "Your feed line")),
                Q(18, "Which mode is narrow bandwidth and useful for weak signals?", "C", O("A", "Wideband FM"), O("B", "Analog TV"), O("C", "CW"), O("D", "Broadcast AM only")),
                Q(19, "What feed line is common for amateur stations?", "A", O("A", "Coaxial cable"), O("B", "Lamp cord only"), O("C", "Speaker wire only"), O("D", "Ribbon cable for all uses")),
                Q(20, "Which safety rule is most important around outdoor antennas?", "C", O("A", "Use the longest mast possible"), O("B", "Work during storms"), O("C", "Stay clear of power lines"), O("D", "Ignore grounding"))
            });
    }
}
