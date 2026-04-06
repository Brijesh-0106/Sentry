type metaDataInterface = {
    number: number;
    title: string;
    user: {
        login: string,
        avatar_url: string
    },
    changed_files: number;
    state: string;
    merged: boolean;
    created_at: string;
    merged_at: string | null;
    html_url: string;
    deletions: number;
    additions: number;
    body: string;
}
type bugInterface = {
    title: string;
    description: string;
}
type fileReviewInterface = {
    file: string | null;
    risk: string;
    comment: string;
}
type aiReviewInterface = {
    score: number;
    summary: string;
    bugs: [bugInterface],
    suggestions: [bugInterface];
    positives: [bugInterface];
    fileReviews: [fileReviewInterface];
}
export type { aiReviewInterface, bugInterface, fileReviewInterface, metaDataInterface };

