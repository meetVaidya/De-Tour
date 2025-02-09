import { useFontStore } from "@/utils/font-store";
import { Button } from "@/components/ui/button";

export function FontSwitcher() {
    const { isOpenDyslexic, toggleFont } = useFontStore();

    return (
        <Button
            onClick={toggleFont}
            variant="outline"
            className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg"
        >
            {isOpenDyslexic ? "Standard Font" : "OpenDyslexic Font"}
        </Button>
    );
}
