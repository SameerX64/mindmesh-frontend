import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Notes = () => {
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Note
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <Card className="glass">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  No notes yet. Click the "New Note" button to create one.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks">
            <Card className="glass">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  No bookmarks yet. Save videos or courses to see them here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notes;