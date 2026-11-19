import HomeView from "@/components/home/HomeView";

// Static page. The verse of the day is picked in the browser (see HomeView), so no server rendering is needed.
export default function Home() {
  return <HomeView />;
}
