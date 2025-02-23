export interface Update {
    type: "plugin" | "library";
    name: string;
    newName: string;
    script: string;
}

export interface UpdateResponse {
    updated: boolean;
    failed?: boolean;
    version?: string;
}