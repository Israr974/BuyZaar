
import React from "react";

const CartLoading = ({ count = 4, variant = "grid" }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  
  const shimmerClass = "bg-gradient-to-r from-bg-alt via-border to-bg-alt rounded bg-[length:200%_100%] animate-shimmer";

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {skeletons.map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex gap-4">
              <div className={`w-24 h-24 ${shimmerClass}`}></div>
              <div className="flex-1 space-y-3">
                <div className={`h-4 w-3/4 ${shimmerClass}`}></div>
                <div className={`h-3 w-1/2 ${shimmerClass}`}></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className={`h-5 w-24 ${shimmerClass}`}></div>
                    <div className={`h-3 w-16 ${shimmerClass}`}></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-md ${shimmerClass}`}></div>
                      <div className={`w-6 h-6 ${shimmerClass}`}></div>
                      <div className={`w-8 h-8 rounded-md ${shimmerClass}`}></div>
                    </div>
                    <div className={`w-8 h-8 rounded-md ${shimmerClass}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-card rounded-xl border border-border p-4 h-full">
        <div className={`w-full aspect-square ${shimmerClass} mb-3`}></div>
        <div className="space-y-2 mb-3">
          <div className={`h-4 w-3/4 ${shimmerClass}`}></div>
          <div className={`h-3 w-1/2 ${shimmerClass}`}></div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className={`h-5 w-20 ${shimmerClass}`}></div>
          <div className={`h-4 w-16 ${shimmerClass}`}></div>
        </div>
        <div className="flex items-center gap-1 mb-4">
          <div className={`h-4 w-16 ${shimmerClass}`}></div>
          <div className={`h-3 w-8 ${shimmerClass}`}></div>
        </div>
        <div className={`h-9 rounded-md ${shimmerClass}`}></div>
      </div>
    );
  }

  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skeletons.map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-4 h-full">
          <div className={`w-full h-48 ${shimmerClass} mb-3`}></div>
          <div className="space-y-2 mb-3">
            <div className={`h-4 w-4/5 ${shimmerClass}`}></div>
            <div className={`h-3 w-3/5 ${shimmerClass}`}></div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className={`h-5 w-20 ${shimmerClass}`}></div>
            <div className={`h-4 w-16 ${shimmerClass}`}></div>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <div className={`h-4 w-16 ${shimmerClass}`}></div>
            <div className={`h-3 w-8 ${shimmerClass}`}></div>
          </div>
          <div className={`h-9 rounded-md ${shimmerClass}`}></div>
        </div>
      ))}
    </div>
  );
};


export const ShimmerEffect = () => (
  <div className="w-full h-full bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
);

export const QuickLoadingCard = () => (
  <div className="bg-card rounded-lg border border-border p-3">
    <div className="w-full h-40 rounded-md mb-2 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
    <div className="h-3 rounded mb-1 w-full bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
    <div className="h-3 rounded w-2/3 mb-2 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
    <div className="h-6 rounded w-1/2 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
  </div>
);

export const CartPageLoading = () => (
  <div className="container-narrow px-4 py-8">
    <div className="mb-8">
      <div className="h-8 w-48 rounded mb-4 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
      <div className="h-4 w-3/4 max-w-md rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg flex-shrink-0 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                <div className="h-3 w-1/2 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                      <div className="w-6 h-6 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                      <div className="w-8 h-8 rounded-md bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                    </div>
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
          <div className="h-6 w-40 rounded mb-6 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-32 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
                <div className="h-4 w-20 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between mb-6">
              <div className="h-5 w-24 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
              <div className="h-5 w-28 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
            </div>
            <div className="h-11 rounded-md mb-4 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
            <div className="h-10 rounded-md bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ProductPageLoading = () => (
  <div className="container-narrow px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="aspect-square rounded-xl bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-20 rounded-lg bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
        <div className="h-4 w-1/2 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
        <div className="h-6 w-32 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-full rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-2/3 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
        </div>
        <div className="h-12 rounded-md bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
      </div>
    </div>
  </div>
);

export const CheckoutPageLoading = () => (
  <div className="container-narrow px-4 py-8">
    <div className="h-8 w-48 rounded mb-8 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="h-6 w-40 rounded mb-4 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="h-6 w-32 rounded mb-4 bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          <div className="space-y-3">
            <div className="h-12 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
            <div className="h-12 rounded bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartLoading;