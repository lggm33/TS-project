export function formatDuration(durationInMinutes: number): string {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  }
  
  if (hours > 0 && minutes === 0) {
    return `${hours}h`;
  }
  
  return `${minutes}min`;
}

export function capitalizeString(text: string): string {
  if (!text) {
    return text;
  }
  
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
  return capitalized;
}
