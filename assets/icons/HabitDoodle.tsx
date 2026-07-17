import Svg, { Circle, G, Path, type SvgProps } from "react-native-svg";

type HabitDoodleProps = SvgProps & {
  size?: number;
};

const HALO = {
  stroke: "#fff",
  strokeWidth: 22,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

const LINE = {
  stroke: "#000",
  strokeWidth: 10,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

const THIN = {
  stroke: "#000",
  strokeWidth: 7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

const PANEL = {
  fill: "#fff",
  stroke: "#000",
  strokeWidth: 8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Doodle illustration from `habit-doodle.svg` — person with routine symbols. */
export function HabitDoodle({ size = 160, ...props }: HabitDoodleProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      accessibilityRole="image"
      accessibilityLabel="Habit routine doodle"
      {...props}
    >
      <Path
        d="M256 55 C357 55 439 137 439 238 C439 334 368 413 276 424"
        {...HALO}
      />
      <Path
        d="M236 424 C143 413 73 334 73 238 C73 142 146 63 239 56"
        {...HALO}
      />
      <Path
        d="M256 55 C357 55 439 137 439 238 C439 334 368 413 276 424"
        {...LINE}
      />
      <Path d="M269 393 L276 424 L309 407" {...LINE} />
      <Path
        d="M236 424 C143 413 73 334 73 238 C73 142 146 63 239 56"
        {...LINE}
      />
      <Path d="M222 32 L254 56 L221 79" {...LINE} />

      <Circle cx={93} cy={111} r={48} {...PANEL} />
      <Path
        d="M63 111 H123 M61 93 V129 M77 101 V121 M125 93 V129 M109 101 V121"
        {...THIN}
      />

      <Circle cx={419} cy={111} r={48} {...PANEL} />
      <Circle cx={419} cy={111} r={31} {...THIN} />
      <Path
        d="M419 93 V113 L433 122 M419 78 V84 M419 138 V144 M386 111 H392 M446 111 H452"
        {...THIN}
      />

      <Circle cx={83} cy={343} r={49} {...PANEL} />
      <Circle cx={83} cy={343} r={18} {...THIN} />
      <Path
        d="M83 306 V317 M83 369 V380 M46 343 H57 M109 343 H120 M57 317 L65 325 M101 361 L109 369 M109 317 L101 325 M65 361 L57 369"
        {...THIN}
      />

      <Circle cx={429} cy={343} r={49} {...PANEL} />
      <Path
        d="M393 322 C407 315 420 318 429 329 V370 C417 360 405 357 393 363 Z"
        {...THIN}
      />
      <Path
        d="M465 322 C451 315 438 318 429 329 V370 C441 360 453 357 465 363 Z"
        {...THIN}
      />
      <Path
        d="M429 329 V370 M404 337 H418 M440 337 H454 M404 352 H416 M442 352 H454"
        {...THIN}
      />

      <Path
        d="M169 359 C177 306 211 277 256 277 C301 277 335 306 343 359 C346 379 331 396 311 396 H201 C181 396 166 379 169 359 Z"
        {...PANEL}
      />
      <Path
        d="M201 396 V342 C201 312 225 292 256 292 C287 292 311 312 311 342 V396"
        {...THIN}
      />
      <Path d="M235 258 V292 M277 258 V292" {...LINE} />
      <Circle cx={256} cy={202} r={68} {...PANEL} />
      <Path
        d="M205 181 C212 148 236 132 256 145 C278 130 306 149 311 181"
        {...LINE}
      />
      <Path
        d="M219 169 C230 153 245 151 256 164 M260 163 C273 150 292 155 300 174"
        {...THIN}
      />
      <Circle cx={187} cy={205} r={15} {...PANEL} />
      <Circle cx={325} cy={205} r={15} {...PANEL} />
      <Circle cx={234} cy={204} r={5} fill="#000" />
      <Circle cx={278} cy={204} r={5} fill="#000" />
      <Path
        d="M249 213 C247 222 253 227 261 222 M229 235 C246 250 270 250 287 235"
        {...THIN}
      />
      <Path
        d="M199 334 C184 349 177 366 174 386 M313 334 C328 349 335 366 338 386"
        {...LINE}
      />

      <G transform="translate(256 431)">
        <Path
          d="M-8 -58 H8 L12 -39 C18 -37 24 -34 29 -30 L47 -37 L58 -22 L44 -9 C46 -3 46 3 44 9 L58 22 L47 37 L29 30 C24 34 18 37 12 39 L8 58 H-8 L-12 39 C-18 37 -24 34 -29 30 L-47 37 L-58 22 L-44 9 C-46 3 -46 -3 -44 -9 L-58 -22 L-47 -37 L-29 -30 C-24 -34 -18 -37 -12 -39 Z"
          fill="#fff"
          stroke="#000"
          strokeWidth={10}
          strokeLinejoin="round"
        />
        <Circle cx={0} cy={0} r={27} {...THIN} />
        <Circle cx={0} cy={0} r={11} {...THIN} />
      </G>
    </Svg>
  );
}
