import React from "react";
import { ScrollView } from "react-native";

interface IData {
  key: number;
  name: string;
  refAPI: string;
}
interface Props {
  TopListElementComponent?: React.ReactNode;
  HeaderComponent?: React.ReactNode;
  StickyElementComponent?: React.ReactNode;
  renderItem?: (item: any) => React.ReactNode;
  data?: IData[];
}
const CusTomFlashList = (props: Props) => {
  const {
    TopListElementComponent,
    HeaderComponent,
    StickyElementComponent,
    renderItem,
    data = [],
  } = props;

  return (
    <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
      {HeaderComponent}
      {StickyElementComponent}
      {TopListElementComponent}

      {data.map((item, index) => (
        <React.Fragment key={index}>{renderItem?.(item)}</React.Fragment>
      ))}
    </ScrollView>
  );
};
export default CusTomFlashList;
