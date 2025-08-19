interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div className="h-[5px] w-full bg-secondary relative">
      <p className="absolute top-1/2 transform -translate-y-1/2 z-10 text-primary px-4 text-2xl font-medium bg-white -translate-x-1/2 left-1/2">
        {title}
      </p>
    </div>
  );
};

export default SectionHeader;
