import CallList from "@/components/CallList";
import MeetingCard from "@/components/MeetingCard";
import React from "react";

const Previuos = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous</h1>
      <CallList type="ended" />
    </section>
  );
};

export default Previuos;
