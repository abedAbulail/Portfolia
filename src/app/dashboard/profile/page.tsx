import ProfileEditor from "@/components/ProfileEditor";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle">
        This information appears on your public portfolio page.
      </p>
      <ProfileEditor />
    </div>
  );
}
