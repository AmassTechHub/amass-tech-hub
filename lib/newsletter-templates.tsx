// Email Newsletter Templates

export const newsletterWelcomeTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3c0a6b; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Amass Tech Hub Newsletter</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Thank you for subscribing to our newsletter! You'll now receive the latest tech news, insights, and updates from across Africa.</p>
      <p>Our weekly newsletter includes:</p>
      <ul>
        <li>Breaking tech news</li>
        <li>In-depth analysis and reviews</li>
        <li>Tutorials and guides</li>
        <li>Tool recommendations</li>
      </ul>
      <p>Stay tuned for our next issue!</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Amass Tech Hub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

export const weeklyNewsletterTemplate = (
  articles: Array<{ title: string; excerpt: string; url: string }>,
  reviews: Array<{ title: string; rating: number; url: string }>,
  tutorials: Array<{ title: string; level: string; url: string }>,
) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3c0a6b; color: white; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
    .section-title { color: #3c0a6b; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
    .article { margin: 15px 0; padding: 10px; border-left: 3px solid #d6a51b; }
    .article-title { font-weight: bold; color: #3c0a6b; }
    .article-excerpt { font-size: 14px; color: #666; margin: 5px 0; }
    .cta-button { display: inline-block; background-color: #d6a51b; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Amass Tech Hub Weekly Newsletter</h1>
      <p>Your weekly dose of African tech news and insights</p>
    </div>

    <div class="section">
      <div class="section-title">Top Stories This Week</div>
      ${articles
        .map(
          (article) => `
        <div class="article">
          <div class="article-title">${article.title}</div>
          <div class="article-excerpt">${article.excerpt}</div>
          <a href="${article.url}" class="cta-button">Read More</a>
        </div>
      `,
        )
        .join("")}
    </div>

    <div class="section">
      <div class="section-title">Latest Reviews</div>
      ${reviews
        .map(
          (review) => `
        <div class="article">
          <div class="article-title">${review.title}</div>
          <div class="article-excerpt">Rating: ${"⭐".repeat(Math.floor(review.rating))}</div>
          <a href="${review.url}" class="cta-button">Read Review</a>
        </div>
      `,
        )
        .join("")}
    </div>

    <div class="section">
      <div class="section-title">Learn Something New</div>
      ${tutorials
        .map(
          (tutorial) => `
        <div class="article">
          <div class="article-title">${tutorial.title}</div>
          <div class="article-excerpt">Level: ${tutorial.level}</div>
          <a href="${tutorial.url}" class="cta-button">Start Learning</a>
        </div>
      `,
        )
        .join("")}
    </div>

    <div class="footer">
      <p>&copy; 2025 Amass Tech Hub. All rights reserved.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">Manage Preferences</a></p>
    </div>
  </div>
</body>
</html>
`
