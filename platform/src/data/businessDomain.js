// The selected industry outranks keyword matches in a title or an archetype label.
export function isAutomotiveService(context = {}, description = '') {
  const industry = context.industryId || context.industryCode;
  if (industry && industry !== 'IND-31' && industry !== 'EMERGING_HYBRID_FRONTIER_MODELS') {
    return industry === 'IND-05' || industry === 'AUTOMOTIVE_SERVICES_SALES';
  }
  const title = `${context.taxonomyTitleFa || ''} ${description}`;
  return /کارواش|اتوسرویس|دیتیلینگ|تعویض[‌\s]+روغن|تعمیرگاه[‌\s]+خودرو|مکانیک[‌\s]+خودرو|آپاراتی|پنچرگیری/.test(title);
}
