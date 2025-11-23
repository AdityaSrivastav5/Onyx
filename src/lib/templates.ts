export const TASK_TEMPLATES = [
    {
        id: "daily-standup",
        name: "Daily Standup",
        description: "Quick daily check-in template",
        icon: "Sun",
        tasks: [
            { title: "Review yesterday's accomplishments", priority: "P2" },
            { title: "Plan today's priorities", priority: "P1" },
            { title: "Identify blockers", priority: "P2" },
        ],
    },
    {
        id: "weekly-review",
        name: "Weekly Review",
        description: "End-of-week reflection",
        icon: "BarChart3",
        tasks: [
            { title: "Review completed tasks", priority: "P2" },
            { title: "Update project status", priority: "P2" },
            { title: "Plan next week's goals", priority: "P1" },
            { title: "Clean up inbox", priority: "P3" },
        ],
    },
    {
        id: "project-kickoff",
        name: "Project Kickoff",
        description: "Start a new project",
        icon: "Rocket",
        tasks: [
            { title: "Define project goals", priority: "P1" },
            { title: "Identify stakeholders", priority: "P2" },
            { title: "Create project timeline", priority: "P1" },
            { title: "Set up project workspace", priority: "P2" },
            { title: "Schedule kickoff meeting", priority: "P2" },
        ],
    },
    {
        id: "content-creation",
        name: "Content Creation",
        description: "Blog post or article workflow",
        icon: "PenTool",
        tasks: [
            { title: "Research topic", priority: "P1" },
            { title: "Create outline", priority: "P1" },
            { title: "Write first draft", priority: "P1" },
            { title: "Edit and revise", priority: "P2" },
            { title: "Add images/media", priority: "P3" },
            { title: "Publish", priority: "P2" },
        ],
    },
    {
        id: "meeting-prep",
        name: "Meeting Preparation",
        description: "Prepare for important meetings",
        icon: "CalendarCheck",
        tasks: [
            { title: "Review agenda", priority: "P1" },
            { title: "Prepare talking points", priority: "P1" },
            { title: "Gather supporting materials", priority: "P2" },
            { title: "Send pre-read to attendees", priority: "P2" },
        ],
    },
    {
        id: "bug-fix",
        name: "Bug Fix Workflow",
        description: "Systematic bug resolution",
        icon: "Bug",
        tasks: [
            { title: "Reproduce the bug", priority: "P1" },
            { title: "Identify root cause", priority: "P1" },
            { title: "Implement fix", priority: "P1" },
            { title: "Write tests", priority: "P2" },
            { title: "Code review", priority: "P2" },
            { title: "Deploy to production", priority: "P2" },
        ],
    },
];

export const HABIT_TEMPLATES = [
    {
        id: "morning-routine",
        name: "Morning Routine",
        habits: [
            { name: "Drink water", description: "Start the day hydrated", color: "blue" },
            { name: "Exercise", description: "10-minute workout", color: "green" },
            { name: "Meditate", description: "5-minute meditation", color: "purple" },
            { name: "Review goals", description: "Check daily priorities", color: "orange" },
        ],
    },
    {
        id: "health-fitness",
        name: "Health & Fitness",
        habits: [
            { name: "Morning workout", description: "30 minutes exercise", color: "green" },
            { name: "Healthy breakfast", description: "Nutritious meal", color: "yellow" },
            { name: "10k steps", description: "Daily step goal", color: "blue" },
            { name: "Drink 8 glasses of water", description: "Stay hydrated", color: "cyan" },
            { name: "Evening stretch", description: "10-minute stretching", color: "purple" },
        ],
    },
    {
        id: "productivity",
        name: "Productivity Habits",
        habits: [
            { name: "Plan the day", description: "Morning planning session", color: "orange" },
            { name: "Deep work session", description: "2-hour focused work", color: "indigo" },
            { name: "Inbox zero", description: "Clear email inbox", color: "red" },
            { name: "Learn something new", description: "30 minutes learning", color: "purple" },
            { name: "Evening review", description: "Reflect on the day", color: "blue" },
        ],
    },
    {
        id: "mindfulness",
        name: "Mindfulness & Wellness",
        habits: [
            { name: "Morning meditation", description: "10-minute practice", color: "purple" },
            { name: "Gratitude journal", description: "Write 3 things", color: "pink" },
            { name: "Digital detox hour", description: "No screens", color: "gray" },
            { name: "Evening walk", description: "20-minute walk", color: "green" },
            { name: "Read before bed", description: "30 minutes reading", color: "yellow" },
        ],
    },
];
