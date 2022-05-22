import { BiMicrophone, BiDonateHeart } from 'react-icons/bi';
import { FiDisc, FiEye, FiRadio } from 'react-icons/fi';
import { MdRadio, MdMusicVideo } from 'react-icons/md';
import { IoMdDownload } from 'react-icons/io';

export const LicenseValues = [
  'audio_streams',
  'distribution_copies',
  'free_downloads',
  'music_videos',
  'music_video_streams',
  'radio_stations',
  'allow_for_profit_performances',
  'non_profit_performances',
];

export const LicenseValuesIcons = {
  audio_streams: FiRadio,
  distribution_copies: FiDisc,
  free_downloads: IoMdDownload,
  music_videos: MdMusicVideo,
  music_video_streams: FiEye,
  radio_stations: MdRadio,
  allow_for_profit_performances: BiMicrophone,
  non_profit_performances: BiDonateHeart,
};
