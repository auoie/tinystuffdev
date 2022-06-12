---
title: Array of Refs
created: Sun Jun 12 03:02:01 AM UTC 2022
---

If you want to create an array of refs, you can use the following:

```tsx
const Ids: FC = () => {
  const ids = ["a", "b", "c"];
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div>
      {ids.map((val) => {
        return (
          <div
            key={val}
            ref={(el) => {
              refs.current.push(el);
            }}
          >
            {val}
          </div>
        );
      })}
    </div>
  );
};
```

Apparently, this is equivalent[^1] to:

```tsx
type RefsType = {
  current: (HTMLDivElement | null)[];
};
const Ids: FC = () => {
  const ids = ["a", "b", "c"];
  const refs = useState<RefsType>({ current: [] })[0];
  return (
    <div>
      {ids.map((val) => {
        return (
          <div
            key={val}
            ref={(el) => {
              refs.current.push(el);
            }}
          >
            {val}
          </div>
        );
      })}
    </div>
  );
};
```

[^1]: See [Dan Abramov's twitter](https://twitter.com/dan_abramov/status/1099842565631819776?lang=en).
