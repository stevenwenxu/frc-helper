import { Student, Parent } from "../common/models/person";
import { StatusInCanada } from "../common/models/status_in_canada";
import "./fill_button.css";

interface StepTrackerProps {
  person: Student | Parent;
}

const studentSteps = [
  { name: "Demographics", key: "demographics" },
  { name: "Citizenship", key: "citizenship" },
  { name: "Address", key: "address" },
  { name: "Phone", key: "phone" },
  { name: "Program ELL", key: "ell" },
  { name: "Educational Background", key: "educationalBackground" },
  { name: "FRC Tracker", key: "frcTracker" }
];

const parentSteps = [
  { name: "Fill Parent", key: "parent" }
];

function isStepComplete(person: Student | Parent, stepKey: string): boolean {
  if (person instanceof Student) {
    // Steps 1-2: Check field existence
    if (stepKey === "demographics") {
      return person.legalFirstName !== "";
    }
    if (stepKey === "citizenship") {
      return person.statusInCanada !== StatusInCanada.NotApplicable;
    }
    // Steps 3-7: Check completedSteps array
    return person.completedSteps.includes(stepKey);
  } else if (person instanceof Parent) {
    // Parent step 1: Check completedSteps array
    return person.completedSteps.includes(stepKey);
  }
  return false;
}

export function isPersonComplete(person: Student | Parent): boolean {
  const steps = person instanceof Student ? studentSteps : parentSteps;
  return steps.every(step => isStepComplete(person, step.key));
}

function wrapText(text: string, maxCharsPerLine: number = 12): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach(word => {
    if ((currentLine + word).length > maxCharsPerLine && currentLine) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function StepTracker({ person }: StepTrackerProps) {
  const steps = person instanceof Student ? studentSteps : parentSteps;
  const stepCount = steps.length;

  // Fixed circle size and spacing
  const circleRadius = 20;
  const lineY = 30;
  const spacingBetweenCircles = 80; // Gap between circle centers

  // Fixed viewBox width - circles stay same size regardless of step count
  const viewBoxHeight = 90;
  const viewBoxWidth = 600;

  // Fixed step spacing
  const stepSpacing = spacingBetweenCircles;

  // Calculate total width needed for this many steps
  const contentWidth = (stepCount - 1) * stepSpacing + 2 * circleRadius;

  // Center the content in viewBox
  const startX = (viewBoxWidth - contentWidth) / 2;

  const lineHeight = 14;

  return (
    <div className="step-tracker-container">
      <svg
        className="step-tracker-svg"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {/* Connecting line */}
        {stepCount > 1 && (
          <line
            x1={startX + circleRadius}
            y1={lineY}
            x2={startX + contentWidth - circleRadius}
            y2={lineY}
            className="step-tracker-line"
          />
        )}

        {/* Circles and content */}
        {steps.map((step, index) => {
          const cx = startX + (index * stepSpacing);
          const cy = lineY;
          const isComplete = isStepComplete(person, step.key);
          const wrappedText = wrapText(step.name, 12);
          const textStartY = cy + circleRadius + 16;

          return (
            <g key={step.key}>
              {/* Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={circleRadius}
                className={`step-tracker-circle ${isComplete ? "complete" : "pending"}`}
              />

              {/* Step number or checkmark */}
              <text
                x={cx}
                y={cy}
                className="step-tracker-text"
                textAnchor="middle"
                dominantBaseline="central"
                fill={isComplete ? "white" : "#007bff"}
              >
                {isComplete ? "✓" : index + 1}
              </text>

              {/* Step name below with text wrapping */}
              <text
                x={cx}
                y={textStartY}
                className="step-tracker-label"
                textAnchor="middle"
                dominantBaseline="start"
              >
                {wrappedText.map((line, i) => (
                  <tspan key={i} x={cx} dy={i === 0 ? 0 : lineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
