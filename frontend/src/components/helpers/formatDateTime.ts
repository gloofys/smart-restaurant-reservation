export function formatDateTime(dateString: string) {
    const date = new Date(dateString);

    const datePart = date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
    });

    const timePart = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return `${datePart} • ${timePart}`;
}