"use client";

export default function Form() {
  return (
    <div>
      <form className="flex flex-col gap-2" action="">
        <input type="text" name="email" />
        <button>Submit</button>
      </form>
    </div>
  );
}
