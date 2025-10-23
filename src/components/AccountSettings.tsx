import { X, Key, Mail, User as UserIcon } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  user: any;
}

export function AccountSettings({ open, onClose, user }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center px-4 py-6 md:p-0">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Username</div>
                <div className="text-xs text-gray-500">{user?.displayName}</div>
              </div>
              <span className="text-sm text-gray-400">Coming soon</span>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Email</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <span className="text-sm text-gray-400">Coming soon</span>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Change Password</div>
                <div className="text-xs text-gray-500">Update your password securely</div>
              </div>
              <span className="text-sm text-gray-400">Coming soon</span>
            </div>
          </div>

          <div className="pt-3">
            <button onClick={onClose} className="w-full py-3 bg-blue-600 text-white rounded-lg">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
