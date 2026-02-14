import { Form } from "react-bootstrap";

export default function Counter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Form.Control
      type="number"
      placeholder="Enter quantity"
      style={{
        width: "100px",
      }}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onKeyDown={(e) => e.preventDefault()}//منع الكتابة
    />
  );
}
