import { SyntheticEvent, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import {
  useGetGroceriesQuery,
  useGetGroceryCategorizationQuery,
} from 'redux-store';
import { Header3Text, PrimaryText, Loading, StatusMessage } from 'shared';
import { BrandsList, CategoryAccordions, TabContent } from './components';
import 'react-image-gallery/styles/css/image-gallery.css';

function a11yProps(index: number) {
  return {
    id: `filter-tab-${index}`,
    'aria-controls': `filter-tabpanel-${index}`,
  };
}

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const { data, isLoading } = useGetGroceriesQuery();
  const { data: categoryData, isLoading: groceryCategoriesLoading }
    = useGetGroceryCategorizationQuery();

  if (isLoading || groceryCategoriesLoading) {
    return <Loading />;
  }

  if (!data) {
    return <StatusMessage text="no data" />;
  }

  const images: ReactImageGalleryItem[] = data?.map(item => ({
    original: item.image_url,
    originalAlt: item.product_name,
    originalTitle: item.handle,
    description: item._id,
  }));

  const RenderImageItem = memo((imageItem: ReactImageGalleryItem) => {
    return (
      <div>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <PrimaryText>
            {imageItem.originalAlt}
          </PrimaryText>
        </div>
        <img
          src={imageItem.original}
          alt={imageItem.originalAlt}
          title={imageItem.originalTitle}
          id={imageItem.description}
        />
      </div>
    );
  });

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <ImageGallery
        items={images}
        showFullscreenButton={false}
        showPlayButton={false}
        showBullets
        autoPlay
        slideDuration={3000}
        onClick={e => {
          const target = e.target as HTMLImageElement;
          navigate(`grocery/${target.title}`);
        }}
        renderItem={item => <RenderImageItem {...item} />}
      />
      <Box sx={{ marginTop: '2rem' }}>
        <Header3Text> Shop by Brands or Categories</Header3Text>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Brands" {...a11yProps(0)} />
          <Tab label="Categories" {...a11yProps(1)} />
        </Tabs>
        <TabContent value={activeTab} index={0}>
          <BrandsList />
        </TabContent>
        <TabContent value={activeTab} index={1}>
          <CategoryAccordions categories={categoryData?.categories ?? []} />
        </TabContent>
      </Box>
    </div>
  );
};

export default HomePage;
