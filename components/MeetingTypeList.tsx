"use client";

import { useState } from "react";
import Homecard from "./Homecard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { toast } = useToast();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({
          title: "please select a date and time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("failed to create a call");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description: description,
          },
        },
      });
      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting created",
      });
    } catch (error) {
      toast({
        title: "failed to create a meeting",
      });
      console.log(error);
    }
  };
  return (
    <section className="grid grid-cols-1  gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Homecard
        img={"/icons/add-meeting.svg"}
        title={"New Meeting"}
        description={"Start an instant meeting"}
        onClick={() => setMeetingState("isInstantMeeting")}
        className={"bg-orange-1"}
      />
      <Homecard
        img={"/icons/schedule.svg"}
        title={"Schedule Meeting"}
        description={"Plan your meeting"}
        onClick={() => setMeetingState("isScheduleMeeting")}
        className={"bg-blue-1"}
      />
      <Homecard
        img={"/icons/recordings.svg"}
        title={"View Recordings"}
        description={"View your recordings"}
        onClick={() => router.push("/recordings")}
        className={"bg-purple-1"}
      />
      <Homecard
        img={"/icons/join-meeting.svg"}
        title={"Join Meeting"}
        description={"Via Invitation Link"}
        onClick={() => setMeetingState("isJoiningMeeting")}
        className={"bg-yellow-1"}
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title={"Create Meeting"}
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="meetingDescription"
              className="text-base text-normal leading-[22px] text-sky-2"
            >
              Add a description
            </label>
            <Textarea
              id="meetingDescription"
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label htmlFor="">Select Date and Time</label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(e) => setValues({ ...values, dateTime: e! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title={"Meeting created"}
          className={"text-center"}
          buttonText={"Copy Meeting Link"}
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink),
              toast({
                title: "Link copied",
              });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title={"Start an instant Meeting"}
        className={"text-center"}
        buttonText={"Start Meeting"}
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title={"Type the link here"}
        className={"text-center"}
        buttonText={"Join Meeting"}
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
