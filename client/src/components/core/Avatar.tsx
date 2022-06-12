import React from "react";

type Props = {
  size?: "small" | "medium" | "large";
  className?: string;
  src?: string;
  name?: string;
  alt?: string;
  onClick?: () => void;
  bg?: string;
  style?: React.CSSProperties;
};

const Avatar = ({
  size = "medium",
  alt,
  bg = "gray-200",
  className,
  name,
  onClick,
  src,
  style,
}: Props) => {
  let randombg = `#${(Math.random() * 0xfffff * 1000000)
    .toString(16)
    .slice(0, 6)}`;

  return (
    <div
      className={` ${
        size === "medium"
          ? "h-12 w-12"
          : size === "large"
          ? "h-20 w-20 "
          : "w-8 h-8"
      } ${className}  rounded-full flex items-center  justify-center overflow-hidden cursor-pointer select-none  font-medium text-white bg-gray-800`}
      onClick={onClick}
      style={{
        backgroundColor: randombg,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover "
          loading="lazy"
        />
      ) : (
        name?.slice(0, 2)
      )}
    </div>
  );
};

export default Avatar;
