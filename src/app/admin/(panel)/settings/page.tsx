import { Card, Field, FormMessage, PageTitle } from '@/components/admin/ui';
import { getSettings } from '@/lib/data';
import { SETTING_FIELDS, SETTING_GROUPS } from '@/lib/settings';
import { changePassword, saveSettings } from '../../actions';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; pw_saved?: string; pw_error?: string }>;
}) {
  const { saved, pw_saved, pw_error } = await searchParams;
  const settings = await getSettings();

  return (
    <>
      <PageTitle title="Settings" description="Contact details and text shown on the website." />

      {saved && (
        <p role="status" className="mb-5 rounded-lg bg-[#e6f6ec] px-4 py-3 text-[0.95rem] text-[#1a7f45]">
          Settings saved. The website now shows the update.
        </p>
      )}

      <form action={saveSettings} className="max-w-3xl space-y-6">
        {SETTING_GROUPS.map((group) => (
          <Card key={group.id} className="p-6">
            <h2 className="font-display text-[1.1rem] font-semibold text-navy-900">{group.title}</h2>
            <div className="mt-4 space-y-4">
              {SETTING_FIELDS.filter((f) => f.group === group.id).map((field) => (
                <Field key={field.key} label={field.label} name={field.key} hint={field.help}>
                  {field.multiline ? (
                    <textarea id={field.key} name={field.key} rows={5} defaultValue={settings[field.key]} className="field-input resize-y" />
                  ) : (
                    <input id={field.key} name={field.key} defaultValue={settings[field.key]} className="field-input" />
                  )}
                </Field>
              ))}
            </div>
          </Card>
        ))}
        <button type="submit" className="btn-primary">
          Save settings
        </button>
      </form>

      <Card className="mt-10 max-w-3xl p-6">
        <h2 id="password" className="font-display text-[1.1rem] font-semibold text-navy-900">
          Change password
        </h2>
        {pw_saved && (
          <p role="status" className="mt-4 rounded-lg bg-[#e6f6ec] px-4 py-3 text-[0.95rem] text-[#1a7f45]">
            Password changed.
          </p>
        )}
        <div className="mt-4">
          <FormMessage error={pw_error} />
        </div>
        <form action={changePassword} className="space-y-4">
          <Field label="Current password" name="current_password" required>
            <input id="current_password" name="current_password" type="password" required autoComplete="current-password" className="field-input" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password" name="new_password" required hint="At least 8 characters.">
              <input id="new_password" name="new_password" type="password" required minLength={8} autoComplete="new-password" className="field-input" />
            </Field>
            <Field label="Repeat new password" name="confirm_password" required>
              <input id="confirm_password" name="confirm_password" type="password" required minLength={8} autoComplete="new-password" className="field-input" />
            </Field>
          </div>
          <button type="submit" className="btn-outline">
            Change password
          </button>
        </form>
      </Card>
    </>
  );
}
