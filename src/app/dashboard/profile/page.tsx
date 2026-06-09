import ProfileEditor from "@/components/ProfileEditor";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-2">Profile</h1>
      <p className="text-slate-400 text-sm mb-8">
        This information appears on your public portfolio page.
      </p>
      <ProfileEditor />
    </div>
  );
}
