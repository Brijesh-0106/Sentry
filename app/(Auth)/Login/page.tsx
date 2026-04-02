import { Field, FieldLabel } from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";

export default function Login() {
  return (
    <>
      <div>
        <Field>
          <FieldLabel htmlFor="input-demo-api-key">Email</FieldLabel>
          <Input id="input-demo-api-key" type="email" placeholder="Email..." />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-api-key">Password</FieldLabel>
          <Input
            id="input-demo-api-key"
            type="password"
            placeholder="Password..."
          />
        </Field>
      </div>
    </>
  );
}
