/* eslint-disable @typescript-eslint/no-explicit-any */
declare const TVWebSDK: any;

type LivenessResults<T> = {
  steps: Array<{
    // gesture images
    name: string; // step name
    image: {
      blob: Blob;
      encrypted: {
        // will be returned if outputEncryptionSettings.key is provided
        hex: string; // encrypted image in base64 string
      };
      id: string; // id of image has been uploaded, appears only when apiCheck is enabled
    };
  }>;
  frontalFaces: Array<T>; // list of frontal image
  frontalFacesEncrypted: Array<string>; // list of frontal image encrypted in base64 string, will be returned if outputEncryptionSettings.key is provided
  frontalScaledImage: Blob; // the scaled frontal image if frontalMinSize was specified
  capturedFrames: Array<T>; // sequence frames array record liveness process.
  video: Blob; // the raw video of liveness process, return if turn on via access key settings
  apiCheckPassed: boolean; // whether all liveness checks passed, appears only when apiCheck is enabled.
  verifyFaceLivenessResult: LivenessResult<T>; // appears only when apiCheck is enabled.
  verifyFacePortraitResult: SanityResult<T>; // appears only when apiCheck is enabled.
};
