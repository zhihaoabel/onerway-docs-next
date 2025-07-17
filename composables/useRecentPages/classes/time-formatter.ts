export class TimeFormatter {
  getColor(timestamp: number): string {
    const now = Date.now();
    const hours = Math.floor(
      (now - timestamp) / (1000 * 60 * 60)
    );

    if (hours < 1) return "text-green-500";
    if (hours < 24) return "text-blue-500";
    if (hours < 168) return "text-yellow-500";
    return "text-gray-400";
  }

  formatI18n(timestamp: number, locale: string): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (locale.startsWith("zh")) {
      if (minutes < 1) return "刚刚";
      if (minutes < 60) return `${minutes} 分钟前`;
      if (hours < 24) return `${hours} 小时前`;
      return `${days} 天前`;
    }

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  }

  format(timestamp: number): string {
    return this.formatI18n(timestamp, "en");
  }
}
