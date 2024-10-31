import { Svg } from "react-native-svg";
import { VictoryPie } from "victory-native";
import Block from "./block";
import { Caption, H2 } from "./styled-title";

interface Label {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart(
  {
  value,
  labels,
  size = 300,
}: {
  value?: number;
  labels: Label[];
  size?: number;
}) {
  const data = labels.map((label) => ({
    x: label.label,
    y: label.value,
    color: label.color,
  }));

  const dynamicInnerRadius = Math.max(size / 4, size / 2.5 - (value ? value / 100 : 10));

  return (
    <Svg width={size} height={size}>
      {value && value > 150 && (
        <Block style={{ position: 'absolute', top: size / 2.2, left: size / 2.3, alignItems: 'center' }}>
          <H2>{value}</H2>
          <Caption>Calories</Caption>
        </Block>
      )}
      <VictoryPie
        animate={{
          duration: 2000,
        }}
        standalone={false}
        width={size}
        height={size}
        innerRadius={dynamicInnerRadius}
        data={data}
        labels={() => null}
        // Customize colors for each slice with the color prop
        colorScale={labels.map((label) => label.color)}
      />
    </Svg>
  );
}
