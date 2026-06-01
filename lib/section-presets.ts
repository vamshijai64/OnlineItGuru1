// Section presets that administrators can add dynamically to templates and course layouts
export const SECTION_PRESETS = [
    {
        title: "Objectives",
        code: "com.sadguru.TitleDescription",
        view: "title-description",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    },
    {
        title: "Key Features",
        code: "com.sadguru.TitleDescriptionWithIcon",
        view: "title-description-with-icon",
        fields: '[{"label":"Icon","name":"icon","type":"select","sourceType":"api","apiUrl":"font-awesome-icons"},{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    },
    {
        title: "Course Syllabus",
        code: "com.sadguru.TitleWithRichDescription",
        view: "title-rich-description",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"richText"}]'
    },
    {
        title: "Projects",
        code: "com.sadguru.TitleDescription",
        view: "title-description-card",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    },
    {
        title: "Training Options",
        code: "com.sadguru.RichTextCardList",
        view: "rich-text-card-list",
        fields: '[{"label":"Flag","name":"flag","type":"text"},{"label":"Html Text","name":"htmlText","type":"richText"}]'
    },
    {
        title: "Upcoming Batches",
        code: "com.sadguru.ScheduleCardList",
        view: "schedule-card-list",
        fields: '[{"label":"Date","name":"date","type":"date"},{"label":"Time","name":"time","type":"text"},{"label":"Week Label","name":"week_label","type":"text"}]'
    },
    {
        title: "FAQ\'S",
        code: "com.sadguru.TitleDescription",
        view: "title-description-with-arrow-icon",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    }
];

export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
