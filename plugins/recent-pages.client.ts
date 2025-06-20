export default defineNuxtPlugin(() => {
  // 在客户端初始化最近浏览页面功能
  if (import.meta.client) {
    const { initialize } = useRecentPages();

    // 立即初始化，不需要等待 onMounted
    initialize();
  }
});
