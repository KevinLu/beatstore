const handleUnlimitedValues = value => value === -1 ? 'Unlimited' : value;
const pluralize = (count, noun, suffix = 's') => `${noun}${count !== 1 ? suffix : ''}`;

/**
 * Creates human-readable text from a license term and value
 * @param {string} term the license term, see the License schema
 * @param {number | boolean} value the value corresponding to the term
 * @returns {string} human-readable text
 */
const parseLicenseValues = (term, value) => {
  switch (term) {
    case 'audio_streams':
      return `${handleUnlimitedValues(value)} online audio ${pluralize(value, 'stream')}`;

    case 'distribution_copies':
      return `Distribute up to ${handleUnlimitedValues(value)} copies`;

    case 'free_downloads':
      return `${handleUnlimitedValues(value)} free ${pluralize(value, 'download')}`;

    case 'music_videos':
      return `${handleUnlimitedValues(value)} music ${pluralize(value, 'video')}`;

    case 'music_video_streams':
      return `${handleUnlimitedValues(value)} music video ${pluralize(value, 'stream')}`;
    
    case 'radio_stations':
      return `Play on ${handleUnlimitedValues(value)} radio ${pluralize(value, 'station')}`;
  
    case 'allow_for_profit_performances':
      return 'Unlimited for-profit live performances';

    case 'non_profit_performances':
      return `${handleUnlimitedValues(value)} non-profit live ${pluralize(value, 'performance')}`;
  
    default:
      return value;
  }
};

export default parseLicenseValues;
