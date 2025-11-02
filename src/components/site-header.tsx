"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const router = useRouter();

  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[--header-height]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-base font-medium">Dashboard</h1>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Refresh Button */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full"
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
          </Button> */}

          {/* Notifications Dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <Bell className="h-5 w-5" />
                {newOrdersCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {newOrdersCount > 9 ? "9+" : newOrdersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>New Orders</span>
                {newOrdersCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {newOrdersCount}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="max-h-[400px] overflow-y-auto">
                {latestOrders.length > 0 ? (
                  <>
                    {latestOrders.map((order) => (
                      <DropdownMenuItem
                        key={order.order_id}
                        className="flex cursor-pointer flex-col items-start gap-1 p-3 hover:bg-accent"
                        onClick={() =>
                          handleOrderClick(order.order_id, order.order_code)
                        }
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="font-semibold">
                            #{order.order_code}
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>

                        <div className="flex w-full items-center justify-between text-sm">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              getStatusColor(order.order_status)
                            )}
                          >
                            {order.order_status}
                          </Badge>
                          <span className="font-medium">
                            {formatPrice(order.total_price)}
                          </span>
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {formatTime(order.created_at)}
                        </span>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="justify-center cursor-pointer font-medium"
                      onClick={handleViewAllOrders}
                    >
                      View All Orders
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem disabled className="justify-center py-8">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Bell className="h-8 w-8 text-muted-foreground/50" />
                      <span className="text-sm text-muted-foreground">
                        No new orders yet
                      </span>
                    </div>
                  </DropdownMenuItem>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </header>
  );
}
