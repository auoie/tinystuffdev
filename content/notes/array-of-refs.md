---
title: Array of Refs
created: Sun Jun 12 03:02:01 AM UTC 2022
description: We look at how to create an array of refs with useRef. There's also a similar implementation using useState.
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

Apparently, this is [equivalent to](https://twitter.com/dan_abramov/status/1099842565631819776):

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

## References

- [https://twitter.com/dan_abramov/status/1099842565631819776](https://twitter.com/dan_abramov/status/1099842565631819776)
