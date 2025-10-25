// Google Analytics event tracking utility
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventData)
  }
}

export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-XXXXXXXXXX", {
      page_path: pagePath,
      page_title: pageTitle,
    })
  }
}

export function trackConversion(conversionId: string, value?: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      conversion_id: conversionId,
      value: value,
    })
  }
}

// Track newsletter signup
export function trackNewsletterSignup(email: string) {
  trackEvent("newsletter_signup", {
    email_domain: email.split("@")[1],
  })
}

// Track contact form submission
export function trackContactSubmission(subject: string) {
  trackEvent("contact_form_submit", {
    subject: subject,
  })
}

// Track content engagement
export function trackContentView(contentType: string, contentId: string, title: string) {
  trackEvent("content_view", {
    content_type: contentType,
    content_id: contentId,
    content_title: title,
  })
}

// Track search
export function trackSearch(searchTerm: string, resultsCount: number) {
  trackEvent("search", {
    search_term: searchTerm,
    results_count: resultsCount,
  })
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
