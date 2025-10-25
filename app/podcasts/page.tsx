import PodcastsClient from "./podcasts-client"

export const metadata = {
  title: "Podcasts - Amass Tech Hub",
  description: "Listen to our tech podcasts featuring industry experts and thought leaders",
}

export default function PodcastsPage() {
  return <PodcastsClient />
}
