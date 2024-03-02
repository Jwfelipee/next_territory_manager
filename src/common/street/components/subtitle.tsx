import clsx from "clsx";

export const Subtitle = () => {
  const Column = ({ children }) => (
    <div className="flex flex-col w-1/2 gap-3">{children}</div>
  );
  const Data = ({ left, right, ...rest }) => (
    <div {...rest} className="flex justify-around items-center h-6 w-full text-sm">
      <div className="w-2/6 flex items-center font-bold">{left}</div>
      <div className={clsx("flex justify-start w-4/6 wrap")}>{right}</div>
    </div>
  );

  return (
    <div className="w-full h-full flex justify-between bg-white  border border-gray-300 rounded-3xl p-4 gap-2">
      <Column>
        <Data
          left={<div className="h-5 w-7 mini:h-6 mini:w-10 bg-primary block"></div>}
          right="Casa Feita"
        />
        <Data left="FD" right="Fundo" />
        <Data left="TR" right="Terreno" />
        <Data left="CM" right="Comércio" />
        <div className="py-4">
          <Data left="TJ" right="Testemunha de Jeová" />
        </div>
      </Column>
      <Column>
        <Data
          id="publisher-not-hit"
          left={<div className="h-5 w-7 mini:h-6 mini:w-10 bg-red-400 block"></div>}
          right="Não Bater"
        />
        <Data left="IG" right="Igreja" />
        <Data left="ES" right="Escola" />
        <Data left="HP" right="Hospital" />
      </Column>
    </div>
  );
};
