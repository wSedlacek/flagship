import React, { Component } from 'react';
import { FlatListProps, StyleProp, View, ViewStyle } from 'react-native';

import { style as S } from '../styles/category.styles';
import CategoryGrid from './category-grid.component';
import CategoryList from './category-list.component';

import {
  CommerceDataSource,
  CommerceTypes,
  withCommerceData,
  WithCommerceProps,
  WithCommerceProviderProps,
} from '@brandingbrand/fscommerce';

import { CategoryBoxProps, GridProps, Loading } from '@brandingbrand/fscomponents';

export interface UnwrappedCategoryProps {
  categoryId?: string;
  format?: 'list' | 'grid';
  columns?: number;
  onNavigate?: (data: CommerceTypes.Category) => void;
  categoryGridProps?: Partial<GridProps<CommerceTypes.Category>>;
  listViewProps?: Partial<FlatListProps<CommerceTypes.Category>>;
  categoryItemProps?: Partial<CategoryBoxProps>;
  renderCategoryItem?: (data: CommerceTypes.Category) => JSX.Element;
  style?: StyleProp<ViewStyle>;
  loadingStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
}

export type CategoryProps = UnwrappedCategoryProps &
  WithCommerceProviderProps<CommerceTypes.Category>;

export class Category extends Component<
  UnwrappedCategoryProps & WithCommerceProps<CommerceTypes.Category>
> {
  componentDidUpdate(
    prevProps: UnwrappedCategoryProps & WithCommerceProps<CommerceTypes.Category>,
  ): void {
    if (prevProps.categoryId !== this.props.categoryId && this.props.commerceLoadData) {
      this.props.commerceLoadData();
    }
  }

  render(): JSX.Element {
    const { commerceData, format, style, loadingStyle } = this.props;

    let content = null;
    let hasImages = false;

    if (commerceData) {
      if (format !== 'list' && commerceData.categories) {
        const categories = commerceData.categories;

        for (const category of categories) {
          if (category.image) {
            hasImages = true;
            break;
          }
        }
      }

      if (hasImages) {
        content = <CategoryGrid {...this.props} />;
      } else {
        content = <CategoryList {...this.props} />;
      }
    } else {
      content = <Loading style={[S.loading, loadingStyle]} />;
    }

    return <View style={[S.container, style]}>{content}</View>;
  }
}

export default withCommerceData<UnwrappedCategoryProps, CommerceTypes.Category>(
  async (dataSource: CommerceDataSource, props: UnwrappedCategoryProps) => {
    return dataSource.fetchCategory(props.categoryId);
  },
)(Category);
