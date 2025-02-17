import LaunchScreen from "./tabs/launch";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  
  return (
    <LaunchScreen 
      navigation={{
        navigate: (name) => {
          if (name === 'Home') {
            router.push('/tabs/Home');
          }
        }
      } as any}
    />
  );
}