export function formatDownloadUrl(url: string) {
    // to help smooth the switch between repositories
    url = url.replace("https://raw.githubusercontent.com/TheLazySquid/Gimloader", "https://raw.githubusercontent.com/Gimloader/client-plugins");
    return url;
}