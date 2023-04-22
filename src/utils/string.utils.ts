export const truncate = ({ length = 3, string }) => {
    return (string.substring(0, length)) + "...";
}