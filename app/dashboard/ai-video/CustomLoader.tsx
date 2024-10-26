import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_components/ui/alert-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Image from "next/image";

export default function CustomLoader({ loading }: { loading: boolean }) {
  return (
    <AlertDialog open={loading}>
      <VisuallyHidden.Root>
        <AlertDialogHeader>
          <AlertDialogTitle>Loading...</AlertDialogTitle>
          <AlertDialogDescription>
            This dialog is to notify the user that the app is in the process of
            loading/processing data
          </AlertDialogDescription>
        </AlertDialogHeader>
      </VisuallyHidden.Root>
      <AlertDialogContent>
        <div className="flex flex-col items-center justify-center my-10">
          <Image
            src={"/work-in-progress.gif"}
            width={100}
            height={100}
            alt="Loading..."
          />
          <h2>Generating your video...Do not Refresh</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
