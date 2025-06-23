import { secondsToTimeString } from '../utils/time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';

export type SearchResultRowData = {
	title: string;
	description: string;
	utteranceText: string;
	utteranceId: number;
	startTime: number;
	endTime: number;
	speaker?: string;
	youtubeId?: string;
}

type SearchResultRowProps = {
	searchResult: SearchResultRowData;
	isActive?: boolean;
	onClick?: (utteranceId: number) => void;
}

export function SearchResultRow({searchResult, isActive, onClick}: SearchResultRowProps) {
	const [showFullDescription, setShowFullDescription] = useState(false);

	const { title, description, utteranceText, utteranceId, startTime, endTime, speaker, youtubeId } = searchResult;
	
	const onClickWrapper = () => {onClick && onClick(utteranceId)};

	let videoThumbnailUrl = ""
	if (youtubeId) {
		videoThumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
	}

	let videoUrl = ""
	if (youtubeId) {
		videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
	}

	return (
		<div className="flex gap-5 p-4 border-b border-nord-dark-1 justify-between items-center">
			<div className="w-1/6 hover:cursor-pointer hover:scale-110 transition" onClick={onClickWrapper}>
				<img src={videoThumbnailUrl} alt="Video Thumbnail" />
			</div>
			<div className='w-5/6'>
				<div>
					<h3
						className={"text-xl w-fit font-semibold hover:cursor-pointer transition-colors duration-200 hover:text-nord-frost-2 hover:underline" + (isActive && " text-nord-frost-2")} 
						onClick={onClickWrapper}
					>
						{title}
					</h3>
					<p className="text-sm text-nord-frost-3 text-justify hover:cursor-pointer" onClick={() => setShowFullDescription(!showFullDescription)}>
						<span 
							className={`block transition-max-height duration-200 ease-in-out overflow-hidden`}
							style={{
								maxHeight: showFullDescription ? '500px' : '20px', // adjust 24px to your line height
							}}
						>
							{description}
						</span>
					</p>
				</div>

				<div className="mt-2">
					<p>{speaker ? speaker : "Unknown Speaker"}</p>
					<p className="">{utteranceText}</p>
				</div>
				
				<div className='flex justify-between mt-3'>
					<p className="text-xs text-nord-dark-4">Start Time: {secondsToTimeString(startTime)}, End Time: {secondsToTimeString(endTime)}</p>
					{youtubeId && <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FF0033] hover:underline">
						<FontAwesomeIcon icon={faYoutube} />
					</a>}
				</div>
			</div>
		</div>
	);

}