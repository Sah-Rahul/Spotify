import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useSong } from "../Context/SongContext";

const Player: React.FC = () => {
  const { selectedSong, nextSong, prevSong } = useSong();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying, selectedSong]);

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = (audioRef.current.duration * +e.target.value) / 100;
    setProgress(+e.target.value);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const vol = +e.target.value;
    audioRef.current.volume = vol;
    setVolume(vol);
  };

  const onEnded = () => nextSong();

  if (!selectedSong) return null;

  return (
    <div className="w-full h-20 bg-[#181818] text-white flex items-center justify-between px-6">
      <audio ref={audioRef} src={selectedSong.audio} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />

      <div className="flex items-center gap-3 w-[25%] min-w-[200px]">
        <img src={selectedSong.thumbnail} alt={selectedSong.title} className="w-12 h-12 rounded" />
        <div>
          <p className="text-sm font-semibold truncate max-w-[150px]">{selectedSong.title}</p>
          <p className="text-xs text-gray-400 truncate max-w-[150px]">{selectedSong.album}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-[40%]">
        <div className="flex items-center gap-6 text-white">
          <SkipBack size={22} className="cursor-pointer" onClick={prevSong} />
          <button onClick={() => setIsPlaying(!isPlaying)} className="bg-white text-black p-2 rounded-full">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <SkipForward size={22} className="cursor-pointer" onClick={nextSong} />
        </div>
        <input type="range" min={0} max={100} value={progress} onChange={onSeek} className="w-full mt-2 cursor-pointer accent-green-500"/>
      </div>

      <div className="flex items-center gap-3 w-[20%] min-w-[100px]">
        <Volume2 size={20} />
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={onVolumeChange} className="cursor-pointer"/>
      </div>
    </div>
  );
};

export default Player;
