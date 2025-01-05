import { DateValue } from "@mantine/dates";
import { format, parseISO } from "date-fns";


// helper function to chunk data into pages
export function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
        return [];
    }

    const head = array.slice(0, size);
    const tail = array.slice(size);

    return [head, ...chunk(tail, size)];
}


export const formatDateTime = (isoString: string): string => {
        const date = parseISO(isoString);
        return format(date, "HH:mm dd/MM/yyyy");
    };


export function formatDate(date: DateValue): string {
    if (date !== null) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    } 
    return ""
}