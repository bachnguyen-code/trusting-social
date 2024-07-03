/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

let started = false;

export default function TVSDKExample() {
  const [error, setError] = useState<string>();
  const [now, setNow] = useState<number>(0);
  const [resultFrontalFaces, setResultFrontalFaces] = useState<string[]>([]);
  const [resultSteps, setResultSteps] = useState<string[]>([]);
  const [resultVideos, setResultVideos] = useState<string[]>();
  const refTVWebSDK = useRef<any>(null);

  useEffect(() => {
    refTVWebSDK.current = new TVWebSDK.SDK({
      container: document.getElementById('web-sdk-container'),
      lang: 'vi',
      enableAntiDebug: false,
      themeVersion: 'v2',
      apiCredentials: {
        accessKey: 'f051dfd3-8a6e-4a15-a4e8-7ea8cdc84a31',
        secretKey: 'vgiKCenoKvhPq79KABbFmxCBu6WX1tdw',
        apiUrl:
          'https://bfbeac11-4485-446e-8c78-51f8b91ee7fe.mock.pstmn.io/api',
      },
    });
    setNow(Date.now());
  }, []);

  function blobToBase64(blob: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  // Setup callback function to interact and receive results from Web SDK
  // This function will be called when a user finishes capture selfie
  function handleLivenessDetectionDone(result: LivenessResults<Blob>) {
    console.log(result);
    const { frontalFaces, steps, video, capturedFrames } = result;
    setResultFrontalFaces(
      frontalFaces.map((blob: Blob) => {
        return URL.createObjectURL(blob);
      })
    );
    setResultSteps(steps.map((s) => URL.createObjectURL(s.image.blob)));
    // setResultVideos(capturedFrames.map((v) => URL.createObjectURL(v)));
  }

  refTVWebSDK?.current?.getListCamera()?.then(() => {
    if (started) {
      return;
    }
    started = true;
    refTVWebSDK.current.livenessDetection({
      title: 'test',
      mode: TVWebSDK.Constants.Mode.ACTIVE,
      onLivenessDetectionDone: handleLivenessDetectionDone,
      clientSettings: {
        data: {
          card_types: [
            {
              code: 'vn.national_id',
              name: 'CMND cũ / CMND mới / CCCD / Hộ chiếu',
              orientation: 'horizontal',
              has_back_side: true,
              front_qr: {
                exist: false,
              },
              back_qr: {
                exist: false,
              },
            },
          ],
          country: 'vn',
          settings: {
            enable_compare_faces: true,
            enable_convert_pdf: true,
            enable_detect_id_card_tampering: true,
            enable_encryption: false,
            enable_face_retrieval: true,
            enable_index_faces: true,
            enable_read_id_card_info: true,
            enable_verify_face_liveness: true,
            enable_verify_id_card_sanity: true,
            enable_verify_portrait_sanity: true,
            liveness_modes: [
              'active',
              'passive',
              'flash',
              'flash_edge',
              'flash_advanced',
            ],
            scan_qr: 'none',
            selfie_camera_options: ['front'],
            selfie_enable_detect_multiple_face: true,
            support_transaction: true,
            utilities: {
              length_video_sec: 5,
              num_of_photo_taken: 3,
              photo_res: '640x640',
              timing_take_photo_sec: '1,2.5,4',
            },
            web_app_crop_face: 'none',
            web_ui: {
              index_collections: [
                {
                  id: 'id_card',
                  label: 'Mặt trước CMND/CCCD/Passport',
                },
                {
                  id: 'portrait',
                  label: 'Hình ảnh selfie của khách hàng',
                },
              ],
              show_score: true,
            },
          },
        },
      },
      captureFrameSettings: {
        enable: true,
        framesIntervalTime: 180,
        framesBatchLength: 15,
      },
      onError: (e: Error) => {
        console.log(e);
        // Handle error
        setError(e.message);
      },
      frontCamera: true,
      onProcessing: () => {
        // Show loading
        setTimeout(() => {
          refTVWebSDK.current.destroyView();
        }, 250);
      },
      onClose: () => {
        document.body.style.height = 'auto';
        refTVWebSDK.current.destroyView();
      },
    });
  });

  return (
    <div>
      {error ? <p className='text-red-600'>{error}</p> : null}
      {resultFrontalFaces.map((i, idx) => {
        return (
          <>
            <p>resultFrontalFaces {idx}:</p>
            <img src={i} width={200} />
            <br />
          </>
        );
      })}
      {resultSteps.map((i, idx) => {
        return (
          <>
            <p>resultSteps {idx}:</p>
            <img src={i} width={200} />
            <br />
          </>
        );
      })}
      {resultVideos?.map((resultVideo) => (
        <div>
          <p>video here</p>
          <video src={resultVideo} width={200} height={200} />
        </div>
      ))}
      <br />
      <div id='web-sdk-container' />
    </div>
  );
}
