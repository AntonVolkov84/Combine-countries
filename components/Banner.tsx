import React from "react";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const Banner = () => {
  return (
    <BannerAd
      unitId="ca-app-pub-9267417700367649/1187711087"
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );
};

export default React.memo(Banner);
